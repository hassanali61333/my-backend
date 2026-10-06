
import reviewModel from "../models/reviewModel.js"

export  const reviewController = async(req,res)=>{
 const { userID,productID ,rating,review, }=req.body

 console.log(req.body)
  try{

  

  
const response= await reviewModel.create({userID,productID,rating,review})
res.json({
  success:true,
  message:"your review and rating sucessfully send"
})
  
    }
  catch (err){
res.status(500).json({
  success:false,
  message:err.message
}) 
}
}


export const getReviews=async(req,res)=>{
const id=req.params.id

  try{
const response= await reviewModel.find({userID :id})
res.status(200).json({
  success:true,
  data:response
})
  }
  catch (err) {
   
    res.status(500).json({
      success:false,
      message:err.message

    })
  }
}