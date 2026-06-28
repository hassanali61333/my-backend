import { reviewController } from "../controllers/reviewController.js";
import { getReviews } from "../controllers/reviewController.js";
import express from "express"

const router=express.Router()


router.post("/review",reviewController)
router.get("/getreview/:id",getReviews)

export default router;