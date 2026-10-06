import express from "express"
import multer  from "multer"
import  {createProduct, getProduct , updateProduct ,deleteProduct,stockDercrese,stockIncrease}  from "../controllers/productController.js"

const router=express.Router()

const storage  = multer.memoryStorage()
const upload = multer({storage}).single("image")

router.post("/createProduct", upload , createProduct )

router.get("/getProduct", getProduct )
router.put("/updateProduct/:id",upload, updateProduct )
router.delete("/deleteProduct/:id", deleteProduct )
router.put("/stockDecrese", stockDercrese )
router.put("/stockIncrese/:id", stockIncrease )






export default router;