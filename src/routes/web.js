import express from "express";
import { getLoginRegister, postRegister, verifyAccount, getLogout, checkLoggedIn, checkLoggedOut } from "./../controllers/authController";
import homeController from "./../controllers/homeController";
import { updateAvatar, updateUserinFo, updatePasswords, disConnectUser, connectUser } from "./../controllers/userController";
import { findUsersContact, findFriendContact, addNew, removeContactRequesSent, removeContactRequesreceived, removeFriendController, approveContactRequesreceived } from "./../controllers/contactController";

import { addNewTextEmoji, addNewImageEmoji, addNewAttachMent } from "./../controllers/messageController";
import { addNewGroupChat } from "./../controllers/groupChatController";
import { markAllControler } from "./../controllers/notifycationController"
import { auValid, userValid } from "../../src/validation/index";
import { auth } from "../services";
import initPassportLocal from "./../controllers/passortController/local";
import passport from "passport";
let router = express.Router();
initPassportLocal();//init dang nhap tk mk
let initRoutes = (app) => {

  router.get("/", checkLoggedIn, homeController);
  router.get("/login-register", checkLoggedOut, getLoginRegister);
  router.post("/register", checkLoggedOut, auValid.register, postRegister);
  router.get("/verify/:token", checkLoggedOut, verifyAccount);
  router.get("/contact/find-users/:keyword", checkLoggedIn, findUsersContact);
  router.get("/contact/find-friends/:keyword", checkLoggedIn, findFriendContact);

  // /contact/find-friends/
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));
  router.get("/logout", checkLoggedIn, getLogout);
  router.put("/user/update-avatar", checkLoggedIn, updateAvatar);
  router.put("/user/update-info", checkLoggedIn, userValid.updateInfo, updateUserinFo);
  router.put("/user/update-password", checkLoggedIn, updatePasswords);
  router.post("/contact/add-new", checkLoggedIn, addNew);
  router.delete("/contact/remove", checkLoggedIn, removeContactRequesSent);
  router.delete("/contact/remove-received", checkLoggedIn, removeContactRequesreceived);
  router.put("/contact/approve-received", checkLoggedIn, approveContactRequesreceived);
  router.delete("/contact/remove-friend", checkLoggedIn, removeFriendController);
  router.put("/notifycation/mark-all", markAllControler);

  router.get("/disconnectUserbyID/:id", checkLoggedIn, disConnectUser);
  router.get("/connectUserbyID/:id", checkLoggedIn, connectUser);
  router.post("/messages/add-text-emoji", checkLoggedIn, addNewTextEmoji);
  router.post("/messages/add-new-image", checkLoggedIn, addNewImageEmoji);

  router.post("/messages/add-new-attachment", checkLoggedIn, addNewAttachMent);
  router.post("/group-chat/add-new", checkLoggedIn, addNewGroupChat);


  ///contact/remove-friend
  return app.use("/", router);
};
module.exports = initRoutes;