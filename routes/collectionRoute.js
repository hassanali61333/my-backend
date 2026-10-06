import express from "express";
import multer from "multer";
import { addCollection, getCollections } from "../controllers/collectionController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

router.post("/addCollection", upload, addCollection);
router.get("/getCollection", getCollections);


export default router;