import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const notificationSchema=new Schema({
userId:{
    type:mongoose.Types.ObjectId,
    ref:'authUser'
},
ref1:{
type:String//ref1:message.sender,
},
name:{
    type:String,//choices:-connectionReceived,connectionRequestAccepted,followedYou,messagedYou
},
description:{
type:String
},
dateTime:{
type:Date,
},
ref2:{
    type:String //ref2:message.receiver,

},
ref3:{
    type:String
}

});
const notification=mongoose.model("notification",notificationSchema);
export default notification;