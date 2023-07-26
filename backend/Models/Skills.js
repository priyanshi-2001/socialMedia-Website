import mongoose from "mongoose";
const Schema=mongoose.Schema
const skillsSchema=new Schema({
    
    name:{
        type:String,
    }
    
});
const skills=mongoose.model("skills",skillsSchema);
export default skills;