import mongoose from "mongoose";
export const connectDB = async () => {
  const { connection } = await mongoose.connect("mongodb://localhost:27017/linkedinClone");
  console.log(`Mongodb is connected with ${connection.host}`);
};