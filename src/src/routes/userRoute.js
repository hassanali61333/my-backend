import express from 'express'
import { signup,login,deleteUser,getUser } from '../controllers/userController.js'
const router= express.Router()

router.post("/addUser",signup)
router.post("/login",login)
router.delete("/deleteUser/:id",deleteUser)
router.get("/getUser",getUser)

export default router;