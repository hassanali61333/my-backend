import express from 'express'
import { signup,login,deleteUser,getUser } from '../controllers/userController.js'
const router= express.Router()
import { loginLimiter } from '../controllers/userController.js'

router.post("/addUser",signup)
router.post("/login",loginLimiter,login)
router.delete("/deleteUser/:id",deleteUser)
router.get("/getUser",getUser)

export default router;