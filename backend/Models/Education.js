import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const educationSchema=new Schema({
userId:{
    type:mongoose.Types.ObjectId,
    ref:'authUser'
},
location:{
    type:mongoose.Types.ObjectId,
    ref:'location'
},
name:{
    type:String, //choices are:-'S' for success and 'P' for pending
},
startDate:{
type:Date,
},
endDate:{
    type:Date,
},
courseName:{
    type:String,
},
marksCategory:{
    type:String
},
instCategory:{
    type:String
},
marks:{
    type:String
}
});
const education=mongoose.model("education",educationSchema);
export default education;