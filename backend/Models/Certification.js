import mongoose from "mongoose";
const Schema=mongoose.Schema;
const certificationSchema=new Schema({
userId:{
    type:Schema.Types.ObjectId,
    ref:'authUser'
},
company:{
    type:Schema.Types.ObjectId,
    ref:'company'
},
link:{
    type:String,
},
fileUploaded:{
    type:String, //we will store in base64
},
skill:{
    type:String,
},
date:{
    type:Date
}

})
const certifications=mongoose.model("certifications",certificationSchema);
export default certifications;