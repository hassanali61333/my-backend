import express from "express"
import { createOrder,deleteOrder,updateOne,getSingleOrder,getAllOrder, trackOrder, stripePayment } from "../controllers/cardController.js"

const router=express.Router()

router.post("/orders",createOrder)
router.delete("/deleteOrder/:id",deleteOrder)
router.put("/updateOne/:id",updateOne)
router.get("/getSingleOrder/:id",getSingleOrder)
router.get("/getAllOrder",getAllOrder)
router.get("/checkStatus/:id",trackOrder)
router.post("/stripePayment",stripePayment)

export default router;
