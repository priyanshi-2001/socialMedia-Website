import mongoose from "mongoose";
const Schema=mongoose.Schema
const LocationSchema=new Schema({
    countryId:{
    type: Schema.Types.ObjectId, ref: 'country'
    },
    name:{
        type:String,
    }

});
const location=mongoose.model("location",LocationSchema);
export default location;