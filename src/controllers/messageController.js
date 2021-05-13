import { addNewTextEmojiSV, addNewImageEmojiSV, addNewAttachMentSV } from "./../services/messageService";
import { transErrors, transSuccess } from "./../../lang/vi";
import multer from "multer";
import uuidv4 from "uuid/v4";
import fsExtra, { symlink } from "fs-extra";
let addNewTextEmoji = async (req, res) => {
  try {
    let sender = {
      id: req.user._id,
      name: req.user.userName,
      avatar: req.user.avatar
    };
    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;
    let newMessage = await addNewTextEmojiSV(sender, receiverId, messageVal, isChatGroup);
    return res.status(200).send({ message: newMessage })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)

  }
}


let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/images/chat/message");
  },
  filename: (req, file, callback) => {
    let maths = ["image/png", "image/jpg", "image/jpeg"];
    if (maths.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);

    }

    let massageImageName = `${file.originalname}`;
    callback(null, massageImageName);
  }
});

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: {
    fileSize: 1048576
  }
}).single("my-image-chat");

let addNewImageEmoji = async (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(error.message);
      }
      return res.status(500).send("error");
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.userName,
        avatar: req.user.avatar
      };
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let ischatGroup = req.body.ischatGroup;
      let newMessage = await addNewImageEmojiSV(sender, receiverId, messageVal, ischatGroup);




      await fsExtra.remove(`${"src/public/images/chat/message"}/${newMessage.file.fileName}`)

      return res.status(200).send({ message: newMessage })
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)

    }
  });

}


let storageAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/images/chat/message");
  },
  filename: (req, file, callback) => {


    let attachmentName = `${file.originalname}`;
    callback(null, attachmentName);
  }
});

let attachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: {
    fileSize: 1048576
  }
}).single("my-attachment-chat");



let addNewAttachMent = async (req, res) => {

  attachmentMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(error.message);
      }
      return res.status(500).send("error");
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.userName,
        avatar: req.user.avatar
      };
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let ischatGroup = req.body.ischatGroup;
      let newMessage = await addNewAttachMentSV(sender, receiverId, messageVal, ischatGroup);


      await fsExtra.remove(`${"src/public/images/chat/message"}/${newMessage.file.fileName}`)



      return res.status(200).send({ message: newMessage })
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)

    }
  });

}
module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImageEmoji: addNewImageEmoji,
  addNewAttachMent: addNewAttachMent
}