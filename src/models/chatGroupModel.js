import monogoose from "mongoose";
let Schema = monogoose.Schema;
let chatGroupSchemal = new Schema({
  name: String,
  userAmount: { type: Number, min: 2, max: 100 },
  messagerAmount: { type: Number, default: 0 },
  userID: String,
  members: [
    { userID: String },

  ],
  createAt: {
    type: Number,
    default: Date.now
  },
  updateAt: {
    type: Number,
    default: Date.now
  },
  deleteAt: {
    type: Number,
    default: null
  }


});
chatGroupSchemal.statics = {
  createNew(item) {
    return this.create(item)
  },
  getChatGroups(userId, limit) {
    return this.find({
      "members": { $elemMatch: { "userID": userId } }
    }).sort({ "updateAt": -1 }).limit(limit).exec();
  },
  getChatGroupById(id) {
    return this.findById(id);
  },
  updateWhenHasNewMessage(id, newMessageAmount) {
    return this.findByIdAndUpdate(id, {
      "messagerAmount": newMessageAmount,
      "updateAt": Date.now()
    }).exec();
  },
  getChatGroupIdsByUser(userId) {
    return this.find({
      "members": { $elemMatch: { "userID": userId } }
    }, { _id: 1 }).exec();
  }

}
module.exports = monogoose.model("chat-groups", chatGroupSchemal); 
