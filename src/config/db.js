import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const url = process.env.MONGODB_URL;
    console.log("🔍 USERNAME:", url?.split("://")[1]?.split(":")[0]);
    console.log("🔍 PASSWORD:", url?.split(":")[2]?.split("@")[0]);
    console.log("🔍 HOST:", url?.split("@")[1]?.split("/")[0]);
    
    await mongoose.connect(url);
    console.log("✅ Connected:", mongoose.connection.host);
  } catch (err) {
    console.log("❌", err.message);
  }
};

export default connectdb;