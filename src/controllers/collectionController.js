import collectionModel from "../models/collectionModel.js";
import uploadImage from "../services/storage.services.js";

// ✅ CREATE COLLECTION (ADMIN)
export const addCollection = async (req, res) => {
  try {
    const { name } = req.body;

    // check duplicate
    const existing = await collectionModel.findOne({ name });

    if (existing) {
      return res.status(400).json({
        message: "Collection already exists"
      });
    }

    let imageUrl = "";

    // ✅ image upload check
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      imageUrl = result.url;
    }

    // create collection
    const collection = await collectionModel.create({
      name,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      collection
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//========================================================get colleciton=================================



// ✅ GET ALL COLLECTIONS
export const getCollections = async (req, res) => {
  try {
    const collections = await collectionModel.find();

    res.status(200).json({
      success: true,
      data:collections
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};