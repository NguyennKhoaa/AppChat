import express from "express"
import connectDB from "./config/connectDB"
import ContacModel from "./models/contactModel";
import configviewEngine from "./config/viewsEgine";
import initRoutes from "./routes/web";
import bodyparser from "body-parser";
import connectFlash from "connect-flash";
import { configSession, sessionStore } from "./config/sessions"
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import passportsocketio from "passport.socketio";
import cookieparser from "cookie-parser";
import configsocketIo from "./config/socketio";


let app = express();

let server = http.createServer(app);
let io = socketio(server);
connectDB();
configSession(app);
configviewEngine(app);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(connectFlash());
app.use(cookieparser());

app.use(passport.initialize());
app.use(passport.session());
let port = 3000;

initRoutes(app);
configsocketIo(sessionStore, io, cookieparser);


initSockets(io);
server.listen(port, (err) => {
  if (err) {
    console.log('err: ' + err);

  } else {
    console.log('server running port: ' + port);
  }

})
