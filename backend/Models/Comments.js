import mongoose from "mongoose";
const Schema=mongoose.Schema;
const commentsSchema=new Schema({
postId:{
    type:mongoose.Types.ObjectId,
    ref:'posts'
},
ref1:{
    type:mongoose.Types.ObjectId,
    ref:'comments'
},
immediateChilds:[{
    children:{
        type:mongoose.Types.ObjectId,//stores immediate children because its easy to show in frontend 
        ref:'comments'
    }
}],
userId:{
    type:mongoose.Types.ObjectId,
    ref:"authUser"
},
path:{
    type:String,
},
description:{
    type:String,
},
ref2:{
    type:String,
},
ref3:{
    type:String
}
});
const comments=mongoose.model("comments",commentsSchema);
export default comments