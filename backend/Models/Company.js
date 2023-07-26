import mongoose from "mongoose";
const Schema=mongoose.Schema
const CompanySchema=new Schema({
    locationId:{
    type: Schema.Types.ObjectId, ref: 'location'
    },
    name:{
        type:String,
    },
    description:{
        type:String,
    }

});
const location=mongoose.model("company",CompanySchema);
export default location;