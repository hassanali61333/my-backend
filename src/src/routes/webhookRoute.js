import express from "express"

const router=express.Router()

router.post("/payment-webhook",express.raw({type : "application/json"}), )

export default router
