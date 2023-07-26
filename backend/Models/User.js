import mongoose from "mongoose";

const Schema=mongoose.Schema
const userSchema=new Schema({
Name:{
    type:String,
    required:true,
},
email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  phNum:{
    type:Number,
  },
  gender:{
    type:String,
  },
  country:{
   type:String
  },
  organization:{
    type:String
  },
  occupation:{
    type:String,
  },
  profilePic:{
    type:String,
  },
  isFresher:{
    type:Boolean,
  },
  skills:{
    type:String,//list of ids of skills from skills table
  },
  headline:{
    type:String,
  },
  bannerImage:{
    type:String,
  },
  openToWork:{
    type:Boolean,
  },
  currentLoc:{
    type:String,
  },
  numOfConnections:{
    type:String,
  },
  numOfFollowers:{
    type:String,
  },
  ref1:{
    type:String,
  },
  ref2:{
    type:String,
  },
  ref3:{
    type:String,
  },
  ref4:{
    type:String,
  }




})
const user= mongoose.model("authUser",userSchema);
// const document1=new user({
//   Name:"demo",
//   email:"demo23@gmail.com",
//   password:'viotto'
// })
// document1.save();
export default user;

