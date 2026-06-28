import { response } from "express";
import cardmodel from "../models/cardModel.js"
import mongoose from "mongoose";
import Stripe from "stripe";


//===============================================create Order===============================================
export const createOrder = async (req, res) => {
  const { fullname, phone, email, address, city, postalcode, ordernotes, items, totalAmount,userID } = req.body;

  try {
    
    const resp = await cardmodel.create({
      fullname,
      phone,
      email,
      address,
      city,
      postalcode,
      ordernotes,
      items,          
      totalAmount,
      userID    
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      data: resp
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const stripePayment = async (req,res)=>{


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { fullname,phone,email,address,  city,postalcode,  ordernotes, items,userID, totalAmount,stripeMethod} = req.body;
console.log(req.body)
try{

  const session = await stripe.checkout.sessions.create({
payment_method_types : ['card'],
mode :'payment',

 line_items : items.map((its)=>({
  price_data:{
    currency:'usd',
    product_data:{
name:its.name
    },
  unit_amount : its.price * 100
  },
  quantity : its.quantity
 })),

 



 success_url: "http://localhost:3000/success",

      cancel_url: "http://localhost:3000/cancell",
  })

const savedata = items.map((its) => ({
  productID: its.productId,
  name: its.name,
  price: its.price,
  quantity: its.quantity,
  total:its.total,
  image:its.image
}));




  res.json({
    success:true,
    url:session.url
  })

  if(session.redirect_on_completion){

  

   const response= await cardmodel.create({
      fullname,
  phone,
  email ,
  address,
  city,
  postalcode,
  ordernotes,
  items:savedata,
  userID,
  totalAmount,
  stripeMethod : "stripe",
  paymentStatus : 'paid'


  })

}
}
catch (err) {
  res.json({
    success:false,
    message:err.message
  })
}

}

//==============================================delete order ===============================================

export const deleteOrder = async(req,res)=>{
  const id = req.params.id;
  try{

    const response = await cardmodel.deleteOne({
      _id :id
    })
    
    res.json({
      success:true,
      message:'order deleted successfully'
    })
  }
  catch (err) {
    res.status(500).json({
      success:false,
      message : err.message
    })
  }

}


//===============================================Update One=================================================

export const updateOne = async (req, res) => {
  const id = req.params.id;
  const { fullname, phone, email, address, city, postalcode, ordernotes, status } = req.body;

  try {
    const response = await cardmodel.updateOne(
      { _id: id },
      {
        fullname, phone, email, address, city, postalcode, ordernotes,
        status   // ✅ status update add karo
      }
    );
    res.json({ success: true, data: response, message: "Order updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//===============================================Get histroy=====================================================


export const getSingleOrder= async(req,res)=>{
       const userID=req.params.id

       try{
        const response = await cardmodel.find({userID:userID})
        res.json({
          success:true,
          message:'order get successfully',
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

//=============================================get all ====================================================
export const getAllOrder= async(req,res)=>{
       const id=req.params.id

       try{
        const response = await cardmodel.find()
        res.json({
          success:true,
          message:'orders get successfully',
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


//==============================================get by porductID==========================================
export const trackOrder = async (req, res) => {
  const orderId = req.params.id;


  if (!mongoose.Types.ObjectId.isValid(orderId)) {
  return res.status(400).send("Invalid Order ID");
}
  try {
    const order = await cardmodel.findById(orderId);
console.log(order)
    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.send({
      success:true,
      status: order.status
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};