import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,   // duplicate collection na bane
    
    },
    image: {
      type: String,
    
    }
  },
  
  {
    timestamps: true
  }
)

const collectionModel = mongoose.model("category", collectionSchema);

export default collectionModel;