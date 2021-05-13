import { getNotifycations, countUnread } from "./../services/notifyService";
import { getALLConversationItems } from "./../services/messageService"
import { getContact, getcontastSent, getcontastRecived, countContast, countContastRecived, countContastSent } from "./../services/contactService";
import { getUser } from "./../services/userService"
import { bufferToBase64, lastItemOfArray, convertTimeStampToFriend } from "./../helpers/clientHelper";
//getUser
let getHomeRegister = async (req, res) => {
  let notifycations = await getNotifycations(req.user._id);
  let contast = await getContact(req.user._id);
  let contastSent = await getcontastSent(req.user._id);
  let contastRecived = await getcontastRecived(req.user._id);
  let getALLConversationItem = await getALLConversationItems(req.user._id);
  let allConversations = getALLConversationItem.allConversations;
  let userConversations = getALLConversationItem.userConversations;
  let groupConversations = getALLConversationItem.groupConversations;

  let allConversationWithMessages = getALLConversationItem.allConversationWithMessages;


  let getuser = await getUser();
  let countContact = await countContast(req.user._id);
  let countContastSents = await countContastSent(req.user._id);
  let countContastReciveds = await countContastRecived(req.user._id);

  let countNotifUnRead = await countUnread(req.user._id);
  if (req.user.isAdmin) {
    res.render("admin/master", {
      errors: req.flash("errors"),
      success: req.flash("success"),
      getuser: getuser
    })

  } else {

    return res.render("main/home/home", {
      errors: req.flash("errors"),
      success: req.flash("success"),
      user: req.user,
      notifycations: notifycations,
      countNotifUnRead: countNotifUnRead,
      contast: contast,
      contastSent: contastSent,
      contastRecived: contastRecived,
      countContast: countContact,
      countContastSent: countContastSents,
      countContastRecived: countContastReciveds,


      allConversations: allConversations,
      userConversations: userConversations,
      groupConversations: groupConversations,
      allConversationWithMessages: allConversationWithMessages,
      bufferToBase64: bufferToBase64,
      lastItemOfArray: lastItemOfArray,
      convertTimeStampToFriend: convertTimeStampToFriend

    });
  }
}
module.exports = getHomeRegister;



