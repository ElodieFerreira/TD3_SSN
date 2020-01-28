import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private msg: string[];
  public msg_subject: Subject<string[]>;

  constructor(private socket:Socket) {
    this.msg = [];
    this.msg_subject = new Subject<string[]>();
    this.socket.fromEvent("message").subscribe((data:string)=>{
      this.msg.push(data);
      this.emitMessage();
    })
  }

  private emitMessage(){
    this.msg_subject.next(this.msg.slice());
  }

  public sendMessage(msg_get:string) {
    this.socket.emit("message", msg_get );
    this.msg.push(msg_get);
    this.emitMessage();
  }
}
