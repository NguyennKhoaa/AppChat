import { pushSocketIdArray, emitNotifyToArray, removeSocketIdToArry } from "./../../helpers/socketHeplers";


let addNewGroupChat = (io) => {
  let client = {};
  io.on("connection", (socket) => {

    client = pushSocketIdArray(client, socket.request.user._id, socket.id);

    socket.on("add-Group-Chat", (data) => {
      client = pushSocketIdArray(client, data.groupChat._id, socket.id);

      let response = {
        groupChat: data.groupChat,
      }

      data.groupChat.members.forEach(member => {
        if (client[member.userID] && member.userID != socket.request.user._id) {
          emitNotifyToArray(client, member.userID, io, "req-add-Group-Chat", response);
        }
      })
    });
    socket.on("member-recivied-group-chat", (data) => {
      client = pushSocketIdArray(client, data.groupChatId, socket.id);
    })

    //xu li f5;
    socket.on("disconnect", () => {
      client = removeSocketIdToArry(client, socket.request.user._id, socket);
    })
    // console.log(client);
  })
}
module.exports = addNewGroupChat;