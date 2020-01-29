import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private msg: string[];
  public msg_subject: Subject<string[]>;
  private event: string;

  constructor(private socket:Socket) {
    // First event expected by the socket
    this.event = "nom";
    this.msg = [];
    this.msg_subject = new Subject<string[]>();

    this.socket.fromEvent("message").subscribe((data:any)=>{
      console.log(data);
      // Take the next event from the data
      this.event = data.event;
      this.msg.push(data.content);
      this.emitMessage();
    });
  }

  private emitMessage(){
    this.msg_subject.next(this.msg.slice());
  }

  public sendMessage(msg_get:string) {
    this.socket.emit(this.event, msg_get );
    this.msg.push(msg_get);
    this.emitMessage();
  }
}
