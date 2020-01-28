import {Component, ViewChild} from '@angular/core';
import {ChatService} from "./service/chat.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-chat';
  private message_sub : Subscription;
  public messages: string[];
  @ViewChild("messageInput",{static:false}) messageInput;
  constructor(private chat_service:ChatService) {
    this.message_sub = new Subscription();

  }

  ngOnInit() {
    this.message_sub = this.chat_service.msg_subject.subscribe((data:string[])=>{
      // Fonction appelé quand le subscribe sera appelé, quand l'object emet
      this.messages = data;
    })
  }

  ngOnDestroy() {
    this.message_sub.unsubscribe();
  }

  submitMessage() {
    // Console ce msg
    // console.log(this.messageInput.nativeElement.value);
    this.chat_service.sendMessage(this.messageInput.nativeElement.value);

  }

}
