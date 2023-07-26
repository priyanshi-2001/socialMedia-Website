import mongoose from "mongoose";
const Schema=mongoose.Schema
const postsSchema=new Schema({
    userId:{
    type: Schema.Types.ObjectId, ref: 'authUser'
    },
    title:{
        type:String,
    },
    body:{
        type:String,
    },
    files:{
        type:String,
    },
    ref1:{
        type:String,
    },
    ref2:{
        type:String,
    },
    createdDate:{
        type:Date,
    },
    modifiedDate:{
        type:Date,
    },
    isActive:{
        type:Boolean
    }
});
const posts=mongoose.model("posts",postsSchema);
export default posts;