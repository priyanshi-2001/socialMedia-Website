import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const connectionsSchema=new Schema({
receiver:{
    type:mongoose.Types.ObjectId,
    ref:'authUser'
},
sender:{
    type:mongoose.Types.ObjectId,
    ref:'authUser'
},
status:{
    type:String, //choices are:-'S' for success and 'P' for pending,'R for rejected
},
date:{
type:Date,
}
});
const connections=mongoose.model("connections",connectionsSchema);
export default connections;