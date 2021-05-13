import { result } from "lodash";
import notificationModel from "./../models/notificationModel";
import userModel from "./../models/userModel";
let getNotifycations = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifycations = await notificationModel.model.getByUserIdAndLimit(currentUserId, limit);
      console.log(notifycations);
      let getNotifContents = notifycations.map(async (noti) => {
        let sender = await userModel.findUserById(noti.senderId);
        console.log(sender)
        return notificationModel.conten.getContent(noti.type, noti.isRead, sender._id, sender.userName, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error)
    }
  })
};
let countUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let countNotif = await notificationModel.model.countUnread(currentUserId);
      resolve(countNotif)
    } catch (error) {
      reject(error)
    }
  })
};
let markAllSV = (currentUserId, tagetUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      await notificationModel.model.markAll(currentUserId, tagetUser);
      resolve(true);
    } catch (error) {
      console.log(`Error when mark notifycations as read: ${error}`);
      reject(false);
    }
  });

}

module.exports = {
  getNotifycations: getNotifycations,
  countUnread: countUnread,
  markAllSV: markAllSV
}