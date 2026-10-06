import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  fullname: { type: String },
  phone: { type: String },
  email: { 
    type: String, 
    match: /^\S+@\S+\.\S+$/   
  },
  address: { type: String },
  city: { type: String },
  postalcode: { type: String },
  ordernotes: { type: String },
  userID:{type :String,required :true},
  // ✅ Naye fields
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },   
    image : {type : String,required :true}

  }],

  totalAmount: { type: Number, required: true }, 

  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  paymentStatus : {type : String , enum : ['paid','unpaid', 'failed'],  default : 'unpaid'},
  paymentMethod : {type :String ,enum : ['cod', 'stripe'], default : 'cod'}

});

const OrderModel = mongoose.model("orders", orderSchema);
export default OrderModel;