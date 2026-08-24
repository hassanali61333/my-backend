import user from "../models/userModel.js";
import jwt from "jsonwebtoken"

// =============================== Insert User Controller =======================================
export const signup = async(req,res)=>{
  const {name,email,password}= req.body;

try{
  console.log(req);
  
  const response = await  user.create({name,email,password})
  res.status(200).json({
    sucess:true,
    message:'user signup suessfull',
    data:response
  })
}
catch (err) {
  res.status(500).json({
    sucess :false,
    message:err.message
  })
}
}

//================================== Login Controller===================================

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const userFound = await user.findOne({ email });

    if (!userFound) {
      return res.status(400).json({
        success: false,
        message: "Email not found"
      });
    }

    if (userFound.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }
    const token = jwt.sign({id : userFound._id , email :userFound.email}, process.env.JWT_SECRET, {expiresIn : "1d"}) 

    res.status(200).json({
      success: true,
      message: "Login successful",
      token :token
      
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};






// =====================================Delete User Controller==================================


export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await user.deleteOne({ _id: id });

    if (response.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: response
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


//=========================================Get all user==============================================


export const getUser=async (req,res)=>{

try{
const resp=  await user.find()
res.json({
  success:true,
  message:"User get successfully",
  data:resp
})

}  
catch (err) {
  res.status(500).json({
    success:false,
    message :err.message
  })
}
}