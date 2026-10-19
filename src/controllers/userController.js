import user from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

// =============================== Rate Limiter (login route par lagayein) ==================
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, try later" },
});

// =============================== Signup Controller =======================================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation + type check (NoSQL injection se bachao)
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // bcrypt sirf pehle 72 bytes use karta hai
    if (password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be at most 72 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check if email already exists
    const existingUser = await user.findOne({ email: normalizedEmail });
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
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 5. Send sanitized response (NO password)
    return res.status(201).json({
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
    // Race condition: do requests ek saath aayen to unique index error deta hai
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    console.error("Signup error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//================================== Login Controller===================================

const MAX_CONCURRENT_HASHES = 4;
let activeHashes = 0;
const queue = [];

const limitedBcryptCompare = (password, hash) => {
  return new Promise((resolve, reject) => {
    const run = async () => {
      activeHashes++;
      try {
        const result = await bcrypt.compare(password, hash);
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        activeHashes--;
        if (queue.length > 0) queue.shift()();
      }
    };

    if (activeHashes < MAX_CONCURRENT_HASHES) {
      run();
    } else {
      const entry = () => {
        clearTimeout(timeout);
        run();
      };

      const timeout = setTimeout(() => {
        const idx = queue.indexOf(entry);
        if (idx > -1) queue.splice(idx, 1);
        reject(new Error("SERVER_OVERLOADED"));
      }, 3000);

      queue.push(entry);
    }
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // Type check (NoSQL injection se bachao)
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userFound = await user.findOne({ email: normalizedEmail });

    if (!userFound) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Limited bcrypt (CPU block rokne ke liye)
    let isMatch;
    try {
      isMatch = await limitedBcryptCompare(password, userFound.password);
    } catch (err) {
      if (err.message === "SERVER_OVERLOADED") {
        return res.status(503).json({
          success: false,
          message: "Server busy, please try again",
        });
      }
      throw err;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: userFound._id,
        email: userFound.email,
        role: userFound.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: userFound._id,
        email: userFound.email,
        name: userFound.name,
        role: userFound.role,
        token,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
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