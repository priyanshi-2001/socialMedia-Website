import mongoose from "mongoose";
const Schema=mongoose.Schema;
const ExperienceSchema=new Schema({
    Status:{
        type:String, //choices:-'P' Past, 'C'-Current
    },
    title:{
        type:String,
    },
    companyId:{
        type:String,
    },
    locationId:{
        type:String
    },
    workDescription:{
        type:String,
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"authUser"
    }
});
const experience=mongoose.model("experience",ExperienceSchema);
export default experience;
