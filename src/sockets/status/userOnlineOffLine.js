import { pushSocketIdArray, emitNotifyToArray, removeSocketIdToArry } from "./../../helpers/socketHeplers";


let userOnlineOffLine = (io) => {
  let client = {};
  io.on("connection", (socket) => {
    client = pushSocketIdArray(client, socket.request.user._id, socket.id);
    // console.log();
    socket.request.user.chatGroupIds.forEach(group => {
      client = pushSocketIdArray(client, group._id, socket.id);
    })
    let listuseronline = Object.keys(client);
    //st1
    socket.emit("server-send-list-user-online", listuseronline);
    //st2
    socket.broadcast.emit("sever-send-when-new-user-online", socket.request.user._id);
    //xu li f5;
    socket.on("disconnect", () => {
      client = removeSocketIdToArry(client, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        client = removeSocketIdToArry(client, group._id, socket);
      })
      //st3
      socket.broadcast.emit("sever-send-when-new-user-offline", socket.request.user._id);
    })
    // console.log(client);
  })
}
module.exports = userOnlineOffLine;