import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SocketIoModule} from "ngx-socket-io";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ChatService} from "./service/chat.service";
import { TableResultComponent } from './components/table-result/table-result.component';
import {ApiServiceService} from "./service/api-service.service";

@NgModule({
  declarations: [
    AppComponent,
    TableResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot({
      url:'http://localhost:3012/',
      options: {}
    })
  ],
  providers: [ChatService,
  ApiServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
