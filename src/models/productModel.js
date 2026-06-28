import mongoose  from "mongoose";

const productSchema = new mongoose.Schema({
  name:{type:String,required:true},
  image:String,
  discountedPrice:Number,
  originalPrice:Number,
  category:String,
  description:[String],
   shortDescription:String,
  stock:Number,
  feature:[String]
},
{
  timestamps:true
}
)


const productmodel = mongoose.model("product",productSchema)
export default productmodel;
