// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},  // no duplicate email allowed
  password:{type:String,required:true},
  avatarUrl: { type: String },
},{timestamps:true});

const userModel=  mongoose.models.User /** if user model is already created */ ||   mongoose.model("User",userSchema); // creating user model

module.exports = {userModel};