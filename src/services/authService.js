import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { transErrors, transSuccess, transMail } from "./../../lang/vi"
import sendMail from "./../config/mailer";
let saltRounds =7;


let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await userModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deleteAt != null) {
        return reject(transErrors.acount_removed);
      }
      if (userByEmail.local.isActive == false) {
        return reject(transErrors.acount_not_active);
      }
      return reject(transErrors.acount_in_use);
    }
    let salt = bcrypt.genSaltSync(saltRounds);
    let userItem = {
      userName: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      },

    };
    let user = await userModel.createNew(userItem);

    let link = `${protocol}://${host}/verify/${user.local.verifyToken}`;

    sendMail(email, transMail.subject, transMail.template(link))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      }).catch(async (err) => {
        await userModel.removeByid(user._id);
        console.log(err)
        reject(transMail.sendFail);
      });

  })

};

let verifyAccount = async (token) => {
  return new Promise(async (resolve, reject) => {
    await userModel.verify(token);
    resolve(transSuccess.Acount_Active);
  });
}


module.exports = {
  register: register,
  verifyAccount: verifyAccount

};