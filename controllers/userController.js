import user from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// =============================== Signup Controller =======================================
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 2. Check if email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    const response = await user.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Send sanitized response (NO password)
    res.status(201).json({
      success: true,
      message: "User signup successful",
      data: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//================================== Login Controller===================================

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const userFound = await user.findOne({ email });

    if (!userFound) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    }

    if (userFound.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: userFound._id,
        email: userFound.email,
        role: userFound.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // JWT ko HttpOnly cookie mein save karo
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Frontend ko sirf required user information bhejo
    const userData = {
      _id: userFound._id,
      email: userFound.email,
      name: userFound.name,
      role: userFound.role,
      token: token, 
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
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