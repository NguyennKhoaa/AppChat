import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import notificationModel from "./../models/notificationModel"
import _ from "lodash";
let findUsersContactSV = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedtUserIds = [currentUserId];//loai id ko dung
    let contactsByuser = await contactModel.findAllByUser(currentUserId);
    contactsByuser.forEach((contact) => {
      deprecatedtUserIds.push(contact.userID);
      deprecatedtUserIds.push(contact.contactID);

    });
    deprecatedtUserIds = _.uniqBy(deprecatedtUserIds);
    deprecatedtUserIds = deprecatedtUserIds.filter(userid => userid !== currentUserId);

    let users = await userModel.findAllForAddContact(deprecatedtUserIds, keyword);
    // console.log(users);
    resolve(users);
  });

}
let addNewSV = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExist = await contactModel.checkExits(currentUserId, contactId);
    if (contactExist) {
      return reject(false);
    }
    let newContactItem = {
      userID: currentUserId,
      contactID: contactId
    };
    let newContact = await contactModel.createNew(newContactItem);
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: notificationModel.types.ADD_CONTACT,
    }
    await notificationModel.model.createNew(notificationItem);

    resolve(newContact)
  })


}

let removeContact = (currentUserId, contactId) => {


}
let removeSV = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let remove = await contactModel.removeRequest(currentUserId, contactId);
    // console.log(remove.result);
    if (remove.result == 0) {
      return reject(false);
    }
    //noti
    let notifTypeaddContact = notificationModel.types.ADD_CONTACT;
    await notificationModel.model.removeRequestNotify(currentUserId, contactId, notifTypeaddContact);
    resolve(true);
  })



}
let getContact = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contact = await contactModel.getContact(currentUserId, 10);
      let users = contact.map(async (ct) => {
        if (ct.contactID == currentUserId) {
          return await userModel.findUserById(ct.userID);

        }
        return await userModel.findUserById(ct.contactID);


      });
      resolve(await Promise.all(users));

    } catch (error) {
      reject(error)
    }

  });
}
let getcontastSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contact = await contactModel.contastSent(currentUserId, 10);
      let users = contact.map(async (ct) => {
        return await userModel.findUserById(ct.contactID);

      });
      resolve(await Promise.all(users));


    } catch (error) {
      reject(error)
    }

  });
}
let getcontastRecived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contact = await contactModel.contastRecived(currentUserId, 10);
      let users = contact.map(async (ct) => {
        return await userModel.findUserById(ct.userID);

      });
      resolve(await Promise.all(users));


    } catch (error) {
      reject(error)
    }

  });
};




let countContast = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countContast(currentUserId);
      resolve(count);

    } catch (error) {
      reject(error)
    }

  });
};
let countContastSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countContastSent(currentUserId);
      resolve(count);

    } catch (error) {
      reject(error)
    }

  });
};
let countContastRecived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countContastRecived(currentUserId);
      resolve(count);

    } catch (error) {
      reject(error)
    }

  });
}
let removeSvReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let remove = await contactModel.removeRequestReceived(currentUserId, contactId);
    console.log(remove.n);
    if (remove.n === 0) {
      return reject(false);
    }
    //noti
    // let notifTypeaddContact = notificationModel.types.ADD_CONTACT;
    // await notificationModel.model.removeRequestNotify(currentUserId, contactId, notifTypeaddContact);
    resolve(true);
  })



}


let approveSvReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let approve = await contactModel.approveRequestReceived(currentUserId, contactId);
    // console.log(approve.result);
    if (approve.n === 0) {
      return reject(false);
    }
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: notificationModel.types.APPROVE_CONTACT,
    }
    await notificationModel.model.createNew(notificationItem);
    //noti
    // let notifTypeaddContact = notificationModel.types.ADD_CONTACT;
    // await notificationModel.model.approveRequestNotify(currentUserId, contactId, notifTypeaddContact);
    resolve(true);
  })


}
let removeFriendSV = (currentUserId, contactId) => {

  return new Promise(async (resolve, reject) => {
    let removeFriend = await contactModel.removeFriend(currentUserId, contactId);
    // console.log(removeFriend);
    if (removeFriend.n === 0) {
      return reject(false);
    }
    //noti
    // let notifTypeaddContact = notificationModel.types.ADD_CONTACT;
    // await notificationModel.model.removeRequestNotify(currentUserId, contactId, notifTypeaddContact);
    resolve(true);
  })


}
let findFriendsContactSV = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await contactModel.getFriends(currentUserId);
    friends.forEach((item) => {
      friendIds.push(item.userID);
      friendIds.push(item.contactID);
    });
    friendIds = _.uniq(friendIds);
    friendIds = friendIds.filter(userid => userid != currentUserId);

    let users = await userModel.findAllToAddGroupChat(friendIds, keyword);
    resolve(users);
  });

}
module.exports = {
  findUsersContactSV: findUsersContactSV,
  addNewSV: addNewSV,
  removeContact: removeContact,
  removeSV: removeSV,
  getContact: getContact,
  getcontastSent: getcontastSent,
  getcontastRecived: getcontastRecived,
  countContast: countContast,
  countContastSent: countContastSent,
  countContastRecived: countContastRecived,
  removeSvReceived: removeSvReceived,
  approveSvReceived: approveSvReceived,
  removeFriendSV: removeFriendSV,
  findFriendsContactSV: findFriendsContactSV
  // removeFriend: removeFriend


}