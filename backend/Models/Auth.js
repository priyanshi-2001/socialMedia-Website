import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const authSchema=new Schema({
userId:{
    type:mongoose.Types.ObjectId,
    ref:'authUser'
},
ref1:{
type:String
},
password:{
    type:String
},
ref2:{
    type:String
},
ref3:{
    type:String
},
email:{
    type:String
}

});
const auth=mongoose.model("auth",authSchema);
export default auth;