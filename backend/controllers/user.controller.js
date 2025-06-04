import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register= async (req,res)=>{
    try{
         const {fullname , email, phoneNumber, password, role}=req.body;
         if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
         };

         const file=req.file;
         let cloudResponse = null;
         if(file){
            const fileUri=getDataUri(file);
            cloudResponse=await cloudinary.uploader.upload(fileUri.content);
         }

         const user=await User.findOne({email});
         if(user){
            return res.status(400).json({
                message:"User already exist with this email.",
                success:false,
            })
         }
         const hashedPassword=await bcrypt.hash(password,10);

         await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse ? cloudResponse.secure_url : null,
            }
         });
         return res.status(201).json({
            message:"Account created successfully.",
            success:true
         });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const  login=async(req,res)=>{
    try{
          const {email,password,role}=req.body;
          if(!email || !password ||!role){
             return res.status(400).json({
                message:"Something is missing",
                success:false
             });
          };
          let user=await User.findOne({email});
          if(!user){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,
            })
          }
          const isPasswordMatch=await bcrypt.compare(password,user.password);
          if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect email or password." ,
                success:false
            })
          };
          //check role is correct or not 
          if(role !== user.role){
            return res.status(400).json({
                message:"Account doesn't exist current role.",
                success:false
            })
          };

          const tokenData={
            userId:user._id
          }
          const token=await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn:'1d'});

          user={
             _id:user._id,
             fullname:user.fullname,
             email:user.email,
             phoneNumber:user.phoneNumber,
             role:user.role,
             profile:user.profile
          }

          return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpOnly:true, sameSite:'lax', secure:false}).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true
          })
    } catch(error){
        console.log(error);
    }
}

export const logout= async (req,res)=>{
    try{ 
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })

    } catch(error){
        console.log(error);
    }
}

export const updateProfile = async (req,res)=>{
    try{
         const {fullname, email, phoneNumber, bio, skills}=req.body;
        
         const file=req.file;
         //console.log("Received file:", file);
         let cloudResponse = null;
         if(file){
            try{
                const fileUri=getDataUri(file);
               // console.log("Data URI length:", fileUri.content.length);
                cloudResponse=await cloudinary.uploader.upload(fileUri.content, { resource_type: "raw",
                    type: "upload", // 🟢 Ensure it's accessible publicly
                    folder: "resumes",
                    public_id: "resume_" + Date.now(),
                 });
               console.log("Cloudinary URL:", cloudResponse.secure_url);

            } catch(uploadError){
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload resume",
                    success: false
                });
            }
         }

         //cloudinary 
        let skillsArray;
        if(skills){
            if(Array.isArray(skills)){
                skillsArray=skills;
            } else if(typeof skills === 'string'){
                skillsArray=skills.split(",").map(skill => skill.trim());
            } else {
                skillsArray=[];
            }
        }
         const userId=req.id;
         let  user= await User.findById(userId);

         if(!user){
            return res.status(404).json({
                message:" User not found.",
                success:false
            })
         }

         //updating data
         if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray

         //resume coming later
         if(cloudResponse){
            user.profile.resume=cloudResponse.secure_url
            user.profile.resumeOriginalName=file.originalname || file.originalName || "unknown"
         }
         
         await user.save();

         user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
         }

         return res.status(200).json({
            message:"Profile updated successsfully.",
            user,
            success:true
         })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
