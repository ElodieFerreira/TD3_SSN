import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as http from "http"
import * as socketio from "socket.io";

import { Person } from "./model/Person";


export class Server {
    private host : string;
    private port: number;
    private app : express.Application;
    private server_http : http.Server;
    private io : socketio.Server;

    constructor(host:string, port:number) {
        
        this.server_http = new http.Server();
        this.io = socketio(this.server_http);
        this.host = host;
        this.port = port;
        this.app = express();

        this.app.get("/",(req:express.Request,res:express.Response)=>{
            res.status(200).send("coucou");
        });

        this.io.on("connection", (socket : socketio.Socket)=>{
            socket.on("message",(msg:string)=>{
                socket.emit("message",msg.toUpperCase());
            })
        });
    }

    public start() {
        this.app.listen(this.port,()=>{
            console.log("Server start on port "+this.port);
        })
        this.server_http.listen(3012, ()=>{
            console.log("Le server http est lance")
        })
    }
}

