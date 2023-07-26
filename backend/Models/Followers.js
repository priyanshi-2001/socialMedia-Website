import mongoose from "mongoose";
const Schema=mongoose.Schema;
const followersSchema=new Schema({
   follower:{
    type:mongoose.Types.ObjectId,//person who is followed
    ref:"authUser"
   },
   followedBy:{
    type:mongoose.Types.ObjectId,//person who follows
    ref:"authUser"
   }
});
const followers=mongoose.model("followers",followersSchema);
export default followers;

