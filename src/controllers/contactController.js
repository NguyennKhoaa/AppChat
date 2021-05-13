import { findUsersContactSV, addNewSV, removeSV, removeSvReceived, removeFriendSV, approveSvReceived, findFriendsContactSV } from "./../services/contactService";

let findUsersContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let Users = await findUsersContactSV(currentUserId, keyword);

    // console.log(Users);
    return res.render("main/contact/section/_findUsersContact", { Users });

  } catch (error) {
    return res.status(500).send(error);
  }

}
let addNew = async (req, res) => {
  try {

    let currentUserId = req.user._id;
    let contactID = req.body.uid;

    let newContact = await addNewSV(currentUserId, contactID);
    // console.log(newContact);
    // console.log(!!newContact);
    return res.status(200).send({
      success: !!newContact
    });

  } catch (error) {
    return res.status(500).send(error);
  }

}

// let removeContact = async(req,res) => {

//   try {

//     let currentUserId = req.user._id;
//     let contactID = req.body.uid;

//     let removeContact = await removeContact(currentUserId, contactID);
//     return res.status(200).send({
//       success: !!removeContact
//     });

//   } catch (error) {
//     return res.status(500).send(error);
//   }
// };
let removeContactRequesSent = async (req, res) => {
  try {

    let currentUserId = req.user._id;
    let contactID = req.body.uid;

    let removeRequest = await removeSV(currentUserId, contactID);
    return res.status(200).send({
      success: !!removeRequest
    });

  } catch (error) {
    return res.status(500).send(error);
  }

}
let removeContactRequesreceived = async (req, res) => {
  try {

    let currentUserId = req.user._id;
    let contactID = req.body.uid;

    let removeRequest = await removeSvReceived(currentUserId, contactID);
    return res.status(200).send({
      success: !!removeRequest
    });

  } catch (error) {
    return res.status(500).send(error);
  }
}

let approveContactRequesreceived = async (req, res) => {
  try {

    let currentUserId = req.user._id;
    let contactID = req.body.uid;

    let approveRequest = await approveSvReceived(currentUserId, contactID);
    return res.status(200).send({
      success: !!approveRequest
    });

  } catch (error) {
    return res.status(500).send(error);
  }
}
let removeFriendController = async (req, res) => {

  try {

    let currentUserId = req.user._id;
    let contactID = req.body.uid;

    let removeFriend = await removeFriendSV(currentUserId, contactID);
    return res.status(200).send({
      success: !!removeFriend
    });

  } catch (error) {
    return res.status(500).send(error);
  }

}
let findFriendContact = async (req, res) => {

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let Users = await findFriendsContactSV(currentUserId, keyword);

    // console.log(Users);
    return res.render("main/groupChat/section/_findFriendsContact", { Users });

  } catch (error) {
    return res.status(500).send(error);
  }
}
module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  //removeContact: removeContact,
  removeContactRequesSent: removeContactRequesSent,
  removeContactRequesreceived: removeContactRequesreceived,
  approveContactRequesreceived: approveContactRequesreceived,
  removeFriendController: removeFriendController,
  findFriendContact: findFriendContact,


}