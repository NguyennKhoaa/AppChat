import { pushSocketIdArray, emitNotifyToArray, removeSocketIdToArry } from "./../../helpers/socketHeplers";


let chatImage = (io) => {
  let client = {};
  io.on("connection", (socket) => {
    client = pushSocketIdArray(client, socket.request.user._id, socket.id);
    // console.log();
    socket.request.user.chatGroupIds.forEach(group => {
      client = pushSocketIdArray(client, group._id, socket.id);
    });

    socket.on("add-Group-Chat", (data) => {
      client = pushSocketIdArray(client, data.groupChat._id, socket.id);
    });
    socket.on("member-recivied-group-chat", (data) => {
      client = pushSocketIdArray(client, data.groupChatId, socket.id);
    });

    socket.on("chat-Image", (data) => {
      if (data.groupId) {
        let response = {
          curentGroupId: data.groupId,
          curentUserId: socket.request.user._id,
          massage: data.message
        };
        if (client[data.groupId]) {
          emitNotifyToArray(client, data.groupId, io, "req-chat-Image", response);
        }
      }
      if (data.contactId) {
        let response = {
          curentUserId: socket.request.user._id,
          massage: data.message
        };
        if (client[data.contactId]) {
          emitNotifyToArray(client, data.contactId, io, "req-chat-Image", response);
        }
      }
    });

    //xu li f5;
    socket.on("disconnect", () => {
      client = removeSocketIdToArry(client, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        client = removeSocketIdToArry(client, group._id, socket);
      })
    })
    // console.log(client);
  })
}
module.exports = chatImage;