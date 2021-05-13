import multer from "multer";
import { transErrors, transSuccess } from "./../../lang/vi";
import uuidv4 from "uuid/v4";
import { updateuser, updatePassWord } from "./../services/userService";
import fsExtra, { symlink } from "fs-extra";
import { validationResult } from "express-validator/check";
import userModel from "./../models/userModel"

let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/images/users");
  },
  filename: (req, file, callback) => {
    let maths = ["image/png", "image/jpg", "image/jpeg"];
    if (maths.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);

    }

    let avatarTen = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarTen);
  }
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {
    fileSize: 1048576
  }
}).single("avatar");

let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(error.message);
      }
      return res.status(500).send("error");
    }
    try {
      let updateImgItem = {
        avatar: req.file.filename,
        updateAt: Date.now()
      };
      let userUpdate = await updateuser(req.user._id, updateImgItem);
      //deleteavatarold
      // await fsExtra.remove(`src/public/images/users/${userUpdate.avatar}`);
      let result = {
        message: transSuccess.update_true,
        imgSrc: `/images/users/${req.file.filename}`
      };
      return res.status(200).send(result);
    } catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  });
}

let updateUserinFo = async (req, res) => {
  let errosArr = [];

  let validationErros = validationResult(req);

  if (!validationErros.isEmpty()) {
    let errors = Object.values(validationErros.mapped());
    errors.forEach((err) => {
      errosArr.push(err.msg)
    })

    return res.status(500).send(errosArr);
  }
  try {
    let updateUserItem = req.body;
    await updateuser(req.user._id, updateUserItem);
    let result = {
      message: transSuccess.update_true,
    };
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

let updatePasswords = async (req, res) => {
  try {
    let updateUserItem = req.body;
    console.log(updateUserItem)
    await updatePassWord(req.user._id, updateUserItem);
    let result = {
      message: transSuccess.update_true,
    };
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error)
  }


}

let disConnectUser = async (req, res) => {
  try {
    let updateUserItem = req.params.id;
    console.log(updateUserItem)
    await userModel.updateIsActive(updateUserItem);
    res.redirect('/');
  } catch (error) {
    return res.status(500).send(error)
  }
}

let connectUser = async (req, res) => {
  try {
    let updateUserItem = req.params.id;
    console.log(updateUserItem)
    await userModel.connectActive(updateUserItem);

    let result = {
      message: transSuccess.Connect_Account,
    };

    res.redirect('/');
    //return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error)
  }
}
// let getUser = ()=>{

// }
module.exports = {
  updateAvatar: updateAvatar,
  updateUserinFo: updateUserinFo,
  updatePasswords: updatePasswords,
  disConnectUser: disConnectUser,
  connectUser: connectUser
  // getUser:getUser
}