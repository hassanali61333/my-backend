import mongoose from "mongoose";




const reviewSchema = new  mongoose.Schema({
  userID : {type: mongoose.Schema.Types.ObjectId,ref :"loginusers", required :true},
  productID : {type :mongoose.Schema.Types.ObjectId, ref:"products", required :true },
  rating: {type :Number , min:1 ,max :5},
  review : {type :String , required :true},
  
},{
  timestamps:true
})

const  reviewModel=mongoose.model("review",reviewSchema)
export default reviewModel; 