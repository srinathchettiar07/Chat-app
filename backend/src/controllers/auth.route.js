import { generatetoken } from "../lib/utils.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generatetoken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const login = async (req , res)=>{
    const {email , password} = req.body;
     try {
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const match = await bcrypt.compare(password , user.password)
        if(!match){
            return res.status(400).json({message:"Invalid credentials"})
        }
        else
        {
            generatetoken(user._id, res);
            res.status(200).json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                bio: user.bio,
                profilePic: user.profilePic
            });
        }
        
     } catch (error) {
        console.log(error + " in login controller");
        res.status(500).json({message:"Internal server error"})
     }
};

export const logout = async (req , res)=>{
    try {
        res.cookie("jwt" , "" , {
            httpOnly: true,
            maxAge: 0, // Set maxAge to 0 to delete the cookie
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
        });
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log(error + " in logout controller");
        res.status(500).json({message:"Internal server error"});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({message:"Please provide a profile picture"});
        }
       const uploadResponse =  await cloudinary.uploader.upload(profilePic)
        const user = await User.findByIdAndUpdate(req.user._id , {
            profilePic: uploadResponse.secure_url
        }, {new: true});
        res.status(200).json(user)
    } catch (error) {
  res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const checkAuth = (req , res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error + " in checkAuth controller");
        res.status(500).json({message:"Internal server error"});
    }
}