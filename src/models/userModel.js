import monogoose from "mongoose";
let Schema = monogoose.Schema;
import bcrypt from "bcrypt"
let userSchemal = new Schema({
  userName: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, defaultL: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: {
      type: String, trim: true
    }
  },
  gooogle: {
    uid: String,
    token: String,
    email: {
      type: String, trim: true
    }
  },
  createAt: {
    type: Number,
    default: Date.now
  },
  updateAt: {
    type: Number,
    default: Date.now
  },
  deleteAt: {
    type: Number,
    default: null
  },
  isAdmin: { type: Boolean, default: false }

});

userSchemal.statics = {
  createNew(item) {
    return this.create(item)
  },
  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },
  getUser() {
    return this.find().exec();
  }
  ,
  removeByid(id) {
    return this.findByIdAndRemove(id).exec();
  },
  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },

  verify(token) {
    return this.findOneAndUpdate(
      {
        "local.verifyToken": token
      },
      {
        "local.isActive": true,
        "local.verifyToken": null
      }).exec();
  },
  findUserById(id) {
    return this.findById(id).exec();
  },
  findUserBySecsionlocalId(id) {
    return this.findById(id, { "local.password": 0 }).exec();
  },
  getNormalUserDataById(id) {
    return this.findById(id, { _id: 1, userName: 1, address: 1, avatar: 1 }).exec();
  },

  updateIsActive(id) {
    return this.findOneAndUpdate(
      {
        "_id": id
      },
      {
        "local.isActive": false
      }).exec();
  },

  connectActive(id) {
    return this.findOneAndUpdate(
      {
        "_id": id
      },
      {
        "local.isActive": true
      }).exec();
  },
  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },
  updatePassword(id, hassedPassword) {
    return this.findByIdAndUpdate(id, { "local.password": hassedPassword }).exec();
  },
  //tim kiem tat ca ban be
  findAllForAddContact(deprecatedtUserIds, keyword) {
    return this.find({
      $and: [
        { "_id": { $nin: deprecatedtUserIds } },
        { "local.isActive": true },
        {
          $or: [
            { "userName": { "$regex": new RegExp(keyword, "i") } },
            { "local.email": { "$regex": new RegExp(keyword, "i") } },
          ]
        }
      ]
    }, { _id: 1, userName: 1, address: 1, avatar: 1 }).exec();

  },
  findAllToAddGroupChat(friendIds, keyword) {
    return this.find({
      $and: [
        { "_id": { $in: friendIds } },
        { "local.isActive": true },
        {
          $or: [
            { "userName": { "$regex": new RegExp(keyword, "i") } },
            { "local.email": { "$regex": new RegExp(keyword, "i") } },
          ]
        }
      ]
    }, { _id: 1, userName: 1, address: 1, avatar: 1 }).exec();

  }
  ,


};

userSchemal.methods = {
  comparepassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
}
module.exports = monogoose.model("user", userSchemal);