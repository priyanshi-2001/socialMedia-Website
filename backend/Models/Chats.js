import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const chatsSchema=new Schema({
receiver:{
    type:mongoose.Types.ObjectId,
    ref:'authUser'
},
sender:{
    type:mongoose.Types.ObjectId,
    ref:'authUser'
},
msg:{
    type:String,
},
date:{
type:Date,
}
});
const chats=mongoose.model("chats",chatsSchema);
export default chats;