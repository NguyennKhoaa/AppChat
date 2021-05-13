import addNewContact from "./contact/addNewContact";
import removeRequestContact from "./contact/removeRequestContact";
import removeRequestReceived from "./contact/removeRequestReceived";
import approveResquesContactRecieved from "./contact/approveRequestContactReceived";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextEmoji";
import chatImage from "./chat/chatImage";
import typingOn from "./chat/typing-on";
import typingOff from "./chat/typing-off";
import chatAttachment from "./chat/chatAttachment";
import userOnlineOffLine from "./status/userOnlineOffLine";
import addNewGroupChat from "./chat/addNewGroupChat";
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContact(io);
  removeRequestReceived(io);
  approveResquesContactRecieved(io);
  removeContact(io);
  chatTextEmoji(io);
  typingOn(io);
  typingOff(io);
  chatImage(io);
  chatAttachment(io);
  userOnlineOffLine(io);
  addNewGroupChat(io);
}
module.exports = initSockets;
//approveResquesContactRecieved