import jwt from "jsonwebtoken";

const isAuthenticated= async(req,res,next)=>{
    try{
         const token=req.cookies.token;
         //console.log("Token received in isAuthenticated middleware:", token);
         if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false,
            })
         }
         const decode=await jwt.verify(token,process.env.SECRET_KEY);
         if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
         };
       //  console.log("Decoded userId from token:", decode.userId);
         req.id=decode.userId;
         next();

    } catch(error){
        console.log(error);
    }
}

export default isAuthenticated;