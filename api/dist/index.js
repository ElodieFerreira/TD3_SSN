"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
let server = new server_1.Server("localhost", 3011);
server.start();
