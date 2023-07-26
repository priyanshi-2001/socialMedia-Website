import mongoose from "mongoose";
const Schema=mongoose.Schema;
const userActivitySchema=new Schema({
user:{
    type:mongoose.Types.ObjectId,
    ref:"authUser"
},
postId:{
    type:mongoose.Types.ObjectId,
    ref:"posts"
},
likes:{
    type:mongoose.Types.ObjectId,
    ref:"likes"
},
comments:{
    type:mongoose.Types.ObjectId,
    ref:"comments"
},
dateTime:{
    type:String,
},
ref1:{
    type:String,
},
ref2:{
    type:String
}
})
const userActivity= mongoose.model("userActivity",userActivitySchema);

export default userActivity;

