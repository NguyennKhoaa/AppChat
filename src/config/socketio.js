import passportsocketio from "passport.socketio";


let configsocketIo = (sessionStore, io, cookieparser) => {
  io.use(passportsocketio.authorize({
    cookieParser: cookieparser,
    key: "express.sid",
    secret: "mySecret",
    store: sessionStore,
    success: (data, accept) => {
      if (!data.user.logged_in) {
        return accept("invalid user", false);
      }
      return accept(null, true);
    },
    fail: (data, message, error, accept) => {
      if (error) {
        console.log("faled connection ", message);
        return accept(new Error(message), false);
      }
    }
  }));
}
module.exports = configsocketIo;