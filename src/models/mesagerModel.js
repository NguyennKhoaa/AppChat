import monogoose from "mongoose";
let Schema = monogoose.Schema;
let messagerSchemal = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String
  },
  receiver: {
    id: String,
    name: String,
    avatar: String
  },
  text: String,
  file: {
    data: Buffer, contentType: String, fileName: String
  },

  createAt: {
    type: Number,
    default: Date.now
  },
  updateAt: {
    type: Number,
    default: null
  },
  deleteAt: {
    type: Number,
    default: null
  }

});
const MESSAGER_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group"
};

messagerSchemal.statics = {
  createNew(item) {
    return this.create(item)
  },
  getMessages(senderId, reciverId, limit) {
    return this.find({
      $or: [
        {
          $and: [
            { "senderId": senderId },
            { "receiverId": reciverId },
          ]
        },
        {
          $and: [

            { "receiverId": senderId },
            { "senderId": reciverId },
          ]
        },
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();

  },
  getMessagesGroup(reciverId, limit) {
    return this.find({ "receiverId": reciverId }).sort({ "createAt": -1 }).limit(limit).exec();

  }
}

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
};

module.exports = {
  model: monogoose.model("messages", messagerSchemal),
  conversationType: MESSAGER_CONVERSATION_TYPES,
  messageType: MESSAGE_TYPES
};