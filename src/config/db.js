import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB Host:", mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
    console.log("Ready State:", mongoose.connection.readyState);
  } catch (err) {
    console.log("DB connection error:", err.message);
  }
};

export default connectdb;
  