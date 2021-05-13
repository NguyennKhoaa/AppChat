import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel"
import mesagerModel from "./../models/mesagerModel";
import _ from "lodash";
import fsExtra from "fs-extra"
let getALLConversationItems = (curentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contact = await contactModel.getContact(curentUserId, 30);
      let userConversationsPromise = contact.map(async (ct) => {
        if (ct.contactID == curentUserId) {
          let getUserContact = await userModel.findUserById(ct.userID);
          getUserContact.updateAt = ct.updateAt;
          return getUserContact;

        } else {
          let getUserContact = await userModel.findUserById(ct.contactID);
          getUserContact.updateAt = ct.updateAt;
          return getUserContact;
          // return await userModel.findUserById(ct.contactID);
        }



      });
      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await chatGroupModel.getChatGroups(curentUserId, 15);
      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return item.updateAt;
      });
      //lay message vo screen chat nhaaaaaaaaaaaaaaaaaaaaa~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let allConversationWithMessagesPromise = allConversations.map(async (conversations) => {
        conversations = conversations.toObject();
        if (conversations.members) {
          let getMessages = await mesagerModel.model.getMessagesGroup(conversations._id, 30);

          conversations.messages = _.reverse(getMessages);
        } else {
          let getMessages = await mesagerModel.model.getMessages(curentUserId, conversations._id, 30);
          conversations.messages = _.reverse(getMessages);
        }

        return conversations;
      });
      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sap xep theo ngay cap nhat nha~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });
      ////////////////////////////
      // console.log("allConversationWithMessages");
      // console.log(allConversationWithMessages);
      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations,
        allConversationWithMessages: allConversationWithMessages
      });
    } catch (error) {
      reject(error)
    }
  })
};
let addNewTextEmojiSV = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) {
          return reject("Khong thay nhom tro chuyen");
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: "GroupSmall.png"
        };
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: mesagerModel.conversationType.GROUP,
          messageType: mesagerModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createAt: Date.now(),

        };
        let newMessage = await mesagerModel.model.createNew(newMessageItem);
        await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagerAmount + 1);
        resolve(newMessage);
      } else {
        let getChatUserReceiver = await userModel.getNormalUserDataById(receiverId);
        if (!getChatUserReceiver) {
          return reject("Khong thay nhom tro chuyen");
        }

        let receiver = {
          id: getChatUserReceiver._id,
          name: getChatUserReceiver.userName,
          avatar: getChatUserReceiver.avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: mesagerModel.conversationType.PERSONAL,
          messageType: mesagerModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createAt: Date.now(),

        };
        let newMessage = await mesagerModel.model.createNew(newMessageItem);
        await contactModel.updateWhenHasNewMessage(sender.id, getChatUserReceiver._id);
        resolve(newMessage);

      }

    } catch (error) {
      reject(error)
    }
  })
};

let addNewImageEmojiSV = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) {
          return reject("Khong thay nhom tro chuyen,group");
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: "GroupSmall.png"
        };

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: mesagerModel.conversationType.GROUP,
          messageType: mesagerModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer, contentType: imageContentType, fileName: imageName
          },
          createAt: Date.now(),

        };
        let newMessage = await mesagerModel.model.createNew(newMessageItem);
        await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagerAmount + 1);
        resolve(newMessage);
      } else {
        let getChatUserReceiver = await userModel.getNormalUserDataById(receiverId);
        if (!getChatUserReceiver) {
          return reject("Khong thay nhom tro chuyen,user");
        }



        let receiver = {
          id: getChatUserReceiver._id,
          name: getChatUserReceiver.userName,
          avatar: getChatUserReceiver.avatar
        };

        let imageBuffer = await fsExtra.readFile(messageVal.path);
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: mesagerModel.conversationType.PERSONAL,
          messageType: mesagerModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer, contentType: imageContentType, fileName: imageName
          },
          createAt: Date.now(),

        };
        let newMessage = await mesagerModel.model.createNew(newMessageItem);
        await contactModel.updateWhenHasNewMessage(sender.id, getChatUserReceiver._id);
        resolve(newMessage);

      }

    } catch (error) {
      reject(error)
    }
  })
};
let addNewAttachMentSV = (sender, receiverId, messageVal, isChatGroup) => {

  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) {
          return reject("Khong thay nhom tro chuyen,group");
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: "GroupSmall.png"
        };

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: mesagerModel.conversationType.GROUP,
          messageType: mesagerModel.messageType.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName
          },
          createAt: Date.now(),

        };
        let newMessage = await mesagerModel.model.createNew(newMessageItem);
        await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagerAmount + 1);
        resolve(newMessage);
      } else {
        let getChatUserReceiver = await userModel.getNormalUserDataById(receiverId);
        if (!getChatUserReceiver) {
          return reject("Khong thay nhom tro chuyen,user");
        }



        let receiver = {
          id: getChatUserReceiver._id,
          name: getChatUserReceiver.userName,
          avatar: getChatUserReceiver.avatar
        };

        let attachmentBuffer = await fsExtra.readFile(messageVal.path);
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: mesagerModel.conversationType.PERSONAL,
          messageType: mesagerModel.messageType.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName
          },
          createAt: Date.now(),

        };
        let newMessage = await mesagerModel.model.createNew(newMessageItem);
        await contactModel.updateWhenHasNewMessage(sender.id, getChatUserReceiver._id);
        resolve(newMessage);

      }

    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  getALLConversationItems: getALLConversationItems,
  addNewTextEmojiSV: addNewTextEmojiSV,
  addNewImageEmojiSV: addNewImageEmojiSV,
  addNewAttachMentSV: addNewAttachMentSV

};