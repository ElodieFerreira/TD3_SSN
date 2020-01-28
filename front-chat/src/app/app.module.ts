import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SocketIoModule} from "ngx-socket-io";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ChatService} from "./service/chat.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot({
      url:'http://localhost:3012/',
      options: {}
    })
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
