"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class Server {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.app = express();
        this.app.get("/", (req, res) => {
            res.status(200).send("coucou");
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log("Server start on port " + this.port);
        });
    }
}
exports.Server = Server;
