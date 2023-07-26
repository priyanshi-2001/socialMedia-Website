import mongoose from "mongoose";
const Schema=mongoose.Schema;
const likesSchema=new Schema({
postId:{
    type:mongoose.Types.ObjectId,
    ref:"posts"
},
reactionType:{
    type:String //'L' for Like, S for support , LV for loves ,LG for laugh
},
userId:{
    type:mongoose.Types.ObjectId,
    ref:"authUser"
    // unique:true//to make sure that a user can only do one reaction at a time
},
time:{
    type:String
}
})
const likes= mongoose.model("likes",likesSchema);

export default likes;

