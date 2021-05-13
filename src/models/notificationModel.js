import monogoose from "mongoose";
let Schema = monogoose.Schema;
let notificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now }
});
notificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestNotify(senderid, receiverid, type) {
    return this.remove({
      $and: [
        { "senderId": senderid },
        { "receiverId": receiverid },
        { "type": type },
      ]
    }).exec();
  },

  getByUserIdAndLimit(userid, limit) {
    return this.find({ "receiverId": userid }).sort({
      "createAt": -1
    }).limit(limit).exec();
  },
  countUnread(userid) {
    return this.count({
      $and: [
        { "receiverId": userid },
        { "isRead": false },
      ]
    }).exec();
  },
  markAll(userid, tagetUser) {
    return this.updateMany({
      $and: [
        { "receiverId": userid },
        { "senderId": { $in: tagetUser } }
      ]
    }, { "isRead": true }).exec();

  }
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
  APPROVE_CONTACT: "approve_contact"

}
const NOTIFICATION_CONTENS = {
  getContent: (notifiType, isRead, userid, username, useravata) => {

    if (notifiType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return `<div class="notif-readed-false" data-uid="${userid}">
        <img class="avatar-small" src="/images/users/${useravata}"
            alt="">
        <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
      </div>`

      } else {
        return `<div class="" data-uid="${userid}">
        <img class="avatar-small" src="/images/users/${useravata}"
            alt="">
        <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
      </div>`

      }

    }
    return "NO maching with notify";
  }
}

module.exports = {
  model: monogoose.model("notification", notificationSchema),
  types: NOTIFICATION_TYPES,
  conten: NOTIFICATION_CONTENS
}

//APPROVE_CONTACT