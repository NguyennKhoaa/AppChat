import { addNewGroup } from "./../services/groupChatService";

let addNewGroupChat = async (req, res) => {

  try {
    let currentUserId = req.user._id;
    let arrayMemberIds = req.body.arrIds;
    let nameGroup = req.body.groupChatName;
    let newGroupChat = await addNewGroup(currentUserId, arrayMemberIds, nameGroup);

    return res.status(200).send({ groupChat: newGroupChat });

  } catch (error) {
    return res.status(500).send(error);
  }
}
module.exports = {
  addNewGroupChat: addNewGroupChat,
}