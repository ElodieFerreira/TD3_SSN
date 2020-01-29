import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as http from "http"
import * as socketio from "socket.io";

import { Person } from "./model/Person";
import {Ssn} from "./model/Ssn";

export class Server {
    private host : string;
    private port: number;
    private app : express.Application;
    private server_http : http.Server;
    private io : socketio.Server;
    private people: Person;

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
            socket.emit("message",{
                content:"Bonjour, quel est votre nom ? ",
                event:"nom",
            });
            socket.on("nom",(msg:string)=>{
                let msg_object = {
                    content:"Votre nom a été enregistré, quel est votre SSN?",
                    event: "SSN"
                }
                let data =  msg.split(/ (.+)/)
                this.people = new Person(data[0],data[1]);
                socket.emit("message",msg_object);
            })
            socket.on("SSN",(msg:string)=>{
                this.people.setSSN(new Ssn(msg));
                this.people.ssn.toString().then((data:string)=>{
                    let msg_object = {
                        content:`Votre SSN a été enregistré
                    Voici les données de votre SSN:
                    ${data}`,
                        event: "test"
                    }
                    console.log("This is my people:")

                    // J'appelle mon
                    console.log(this.people);
                    socket.emit("message",msg_object);
                });
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

