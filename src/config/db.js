import mongoose from "mongoose";

const connectdb = async () => {
  try {
await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected");
  } catch (err) {
    console.log("DB connection error:", err.message);
  }
};

export default connectdb;




