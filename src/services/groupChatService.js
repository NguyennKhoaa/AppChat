import _ from "lodash";
import chatGroupModel from "./../models/chatGroupModel"
let addNewGroup = (currentUserId, arrayMemberIds, nameGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      //
      arrayMemberIds.unshift({
        userID: `${currentUserId}`
      });
      arrayMemberIds = _.uniqBy(arrayMemberIds, "userID");
      console.log(arrayMemberIds)
      let newGroupItem = {

        name: nameGroup,
        userAmount: arrayMemberIds.length,
        userID: `${currentUserId}`,
        members: arrayMemberIds,

      }
      let newGroup = await chatGroupModel.createNew(newGroupItem);
      resolve(newGroup);
    } catch (error) {
      reject(error)
      console.log(error)
    }
  })

}
module.exports = {
  addNewGroup: addNewGroup
}