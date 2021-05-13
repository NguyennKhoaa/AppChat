import UserModel from "./../models/userModel";
import { transErrors } from "./../../lang/vi";
import bcrypt from "bcrypt";
const salaRound = 7;
let updateuser = (id, item) => {
  return UserModel.updateUser(id, item);
};
let updatePassWord = (id, dataupdate) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findUserById(id);
    if (!currentUser) {
      return reject(transErrors.account_undefine);
    }
    let checkcurrenpassword = await currentUser.comparepassword(dataupdate.passwordOld);
    // console.log(dataupdate);
    if (!checkcurrenpassword) {
      return reject(transErrors.pass_fail);
    }
    let salt = bcrypt.genSaltSync(salaRound);
    await UserModel.updatePassword(id, bcrypt.hashSync(dataupdate.passwordNew, salt));
    resolve(true);


  });
}
let getUser = () => {

  return new Promise(async (resolve, reject) => {
    let users = await UserModel.getUser();
    // console.log(users);
    resolve(users);
  });


}
module.exports = {
  updateuser: updateuser,
  updatePassWord: updatePassWord,
  getUser: getUser
}