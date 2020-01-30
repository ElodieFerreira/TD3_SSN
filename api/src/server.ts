import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as http from "http"
import * as socketio from "socket.io";
import * as mongoose from "mongoose";

import { Person } from "./model/Person";
import {Ssn} from "./model/Ssn";

//exemple ssn (wikipedia) 269054958815780

export class Server {
    private host : string;
    private port: number;
    private app : express.Application;
    private server_http : http.Server;
    private io : socketio.Server;
    private person: Person;
    private dataBaseConnection: mongoose.Connection;
    private databaseModelPerson: mongoose.Model<mongoose.Document, {}>;

    constructor(host:string, port:number) {
        this.server_http = new http.Server();
        this.io = socketio(this.server_http);
        this.host = host;
        this.port = port;
        this.app = express();

        this.app.get("/",(req:express.Request,res:express.Response)=>{
            res.status(200).send("coucou");
        });

        //socket io configuration
        this.io.on("connection", (socket : socketio.Socket)=>{
            this.sendMessageSocketIo("Bonjour, quel est votre nom ? ", "nom", socket)

            socket.on("nom",(msg:string)=>{
                let msg_object = {
                    content:"Votre nom a été enregistré, quel est votre SSN?",
                    event: "SSN"
                }
                
                let data =  msg.split(/ (.+)/);

                this.person = new Person(data[0],data[1]);
                socket.emit("message",msg_object);
            })
            
            socket.on("SSN",(msg:string)=>{
                let ssn = new Ssn(msg);
                if(ssn.GetValidite()){
                    this.person.setSSN(ssn);

                    this.person.ssn.getInfo().then(()=>{

                        let content = `Votre SSN a été traité.
                        Voici les données de votre SSN:
                        ${this.person.ssn.toString()}
                        Les données sont-elles exactent ?`;

                        this.sendMessageSocketIo(content, "verification", socket);
                    });      
                }
                else{
                    this.sendMessageSocketIo("votre SSN est pas valide. Veuillez rentrer un nouveau SSN.", "SSN", socket);
                }
            });

            socket.on("verification", (msg:string) => {
                if(msg.toLowerCase() === "oui"){
                    this.sendMessageSocketIo("Voulez-vous sauvegarder votre résultat ?", "sauvegarde", socket);
                } 
                else if(msg.toLowerCase() === "non") {
                    this.sendMessageSocketIo("Veuillez entre une nouvelle fois votre SSN.", "SSN", socket);
                }
                else{
                    this.sendMessageSocketIo("Je ne comprends pas votre réponse. Recommencez ?", "verification", socket);
                }
            });

            socket.on("sauvegarde", (msg:string) => {
                try{
                    console.log(msg)
                if(msg.toLowerCase() === "oui"){
                        let person = new this.databaseModelPerson(this.person).save().then((result) => {
                        this.sendMessageSocketIo("Votre SSN a été sauvegardé. Merci de m'avoir utilisé ! Vous pouvez à tout moment recommencer en tapant un nouveau nom.", "nom", socket);
                    }, (err) => {

                        this.sendMessageSocketIo("Votre SSN n'a pas pu être à cause d'une erreur interne. Excusez nous du désagrément.\n Merci de m'avoir utilisé ! Vous pouvez à tout moment recommencer en tapant un nouveau nom.", "nom", socket);
                    });
                    
                } 
                else if(msg.toLowerCase() === "non") {
                    this.sendMessageSocketIo("Merci de m'avoir utilisé ! Vous pouvez à tout moment recommencer en tapant un nouveau nom.", "SSN", socket);
                }
                else{
                    this.sendMessageSocketIo("Je ne comprends pas votre réponse. Recommencez ?", "sauvegarde", socket);
                }
                } catch(e){
                    console.log(e);
                }
            });


        });
    }

    private sendMessageSocketIo(content: string, event: string, socket: socketio.Socket){
        let msg_object = {
            content: content,
            event: event
        }

        socket.emit("message", msg_object);
    }

    public start() {
                
        mongoose.createConnection("mongodb://db:27017/td3", {
            useUnifiedTopology: true
        }).then((conn) => {
            this.dataBaseConnection = conn;
            
            //base de données configuration
            let personSchema = new mongoose.Schema({
                prenom: String,
                nomDeFamille: String,
                ssn: {
                    departement_nom : String,
                    departement_numero: String,
                    date_de_naissance: String,
                    commune_nom: String,
                    commune_numero: String,
                    sexe: String,
                    validite: Boolean,
                    ssn: String
                }
            });

            this.databaseModelPerson = this.dataBaseConnection.model('person', personSchema);
            console.log("connected to database on db:27017/td3")
        })

        this.app.listen(this.port,()=>{
            console.log("Server start on port "+this.port);
        });

        this.server_http.listen(3012, ()=>{
            console.log("Le server http est lance")
        });
    }

}

