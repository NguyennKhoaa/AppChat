import { pushSocketIdArray, emitNotifyToArray, removeSocketIdToArry } from "./../../helpers/socketHeplers";


let addNewContact = (io) => {
  let client = {};
  io.on("connection", (socket) => {
    // console.log("socket.request.user._id")
    // console.log(socket.request.user._id)
    client = pushSocketIdArray(client, socket.request.user._id, socket.id);
    // console.log(client);
    // console.log(socket.id);
    socket.on("add-new-contact", (data) => {

      // console.log(data);
      // console.log(socket.request.user)
      let currentUser = {
        id: socket.request.user._id,
        userName: socket.request.user.userName,
        avatar: socket.request.user.avatar,
        address: socket.request.user.address == "",
      };
      //goit thong bao emit
      if (client[data.contactId]) {
        emitNotifyToArray(client, data.contactId, io, "req-add-new-contact", currentUser);
      }
      // io.sockets.emit("req-add-new-contact", currentUser);

    });

    //xu li f5;
    socket.on("disconnect", () => {
      client = removeSocketIdToArry(client, socket.request.user._id, socket);
    })
    // console.log(client);
  })
}
module.exports = addNewContact;