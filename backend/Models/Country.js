import mongoose from "mongoose";
const countrySchema= new mongoose.Schema({
name:{
    type:String,
}
});
const country=mongoose.model("country",countrySchema);
export default country;
