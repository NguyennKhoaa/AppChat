import { pushSocketIdArray, emitNotifyToArray, removeSocketIdToArry } from "./../../helpers/socketHeplers";
let removeRequestContact = (io) => {
  let client = {};
  io.on("connection", (socket) => {

    client = pushSocketIdArray(client, socket.request.user._id, socket.id);
    // console.log(client);
    // console.log(socket.id);
    socket.on("remove-request-contact-received", (data) => {
      // console.log(data);
      // console.log(socket.request.user)
      let currentUser = {
        id: socket.request.user._id,
      };
      //goit thong bao emit
      if (client[data.contactId]) {
        emitNotifyToArray(client, data.contactId, io, "req-remove-request-contact-received", currentUser);
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
module.exports = removeRequestContact;