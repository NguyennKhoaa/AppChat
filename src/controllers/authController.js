import { validationResult } from "express-validator/check"
import { auth } from "./../services/index";
import { transSuccess } from "./../../lang/vi";
import userModel from "./../models/userModel";
let getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")

  });
};
let postRegister = async (req, res) => {
  let errosArr = [];
  let successArr = [];

  let validationErros = validationResult(req)
  if (!validationErros.isEmpty()) {
    let errors = Object.values(validationErros.mapped());

    errors.forEach((err) => {
      errosArr.push(err.msg)
    })
    req.flash("errors", errosArr)
    return res.redirect("/login-register");
  }
  try {
    let createUserSuccsess = await auth.register(req.body.email, req.body.gender, req.body.password, req.protocol, req.get("host"));
    successArr.push(createUserSuccsess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errosArr.push(error);
    req.flash("errors", errosArr)
    return res.redirect("/login-register");
  }

  // console.log(req.body);

}
let verifyAccount = async (req, res) => {
  let errosArr = [];
  let successArr = [];
  try {
    let verifiSuccess = await auth.verifyAccount(req.params.token);
    successArr.push(verifiSuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (err) {
    errosArr.push(err);
    req.flash("errors", err)
    return res.redirect("/login-register");
  }
}

let getLogout = (req, res) => {
  req.logout(); //remove secsion pastport
  req.flash("success", transSuccess.logout_success);
  return res.redirect("/login-register");
};
let checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) { //kiem tra login 
    return res.redirect("/login-register");
  }
  next();
}
let checkLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) { //kiem tra logout 
    return res.redirect("/");
  }
  next();
}
module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  verifyAccount: verifyAccount,
  getLogout: getLogout,
  checkLoggedIn: checkLoggedIn,
  checkLoggedOut: checkLoggedOut

};