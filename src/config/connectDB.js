import mongoose from "mongoose";


const mongooes = require("mongoose");

const url = `mongodb://localhost:27017/NORAPP`
const connectDB = async () => {
  try {
    await mongooes.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("connect DB")
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
module.exports = connectDB;