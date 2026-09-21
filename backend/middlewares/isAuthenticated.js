import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = async (req, res, next)=>{
    try {
        
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: 'Authorization token is missing or invalid.'
            })
        } 
        const token = authHeader?.split(" ")[1];
         if (!token) {
         return res.status(401).json({
         success: false,
         message: "Token missing"
          });
         }
          
        let decoded
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                return res.status(401).json({
                success: false,
                message: "The registration token has expired"
                })
                
            }
             return res.status(401).json({
                success: false,
                message: "Access token is missing or invalid"
                })  
        }
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
                })  
        }
        req.user = user;
        req.userId = user._id
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const isAdmin = (req, res, next)=>{
    try {
        if(req.user && req.user.role === 'admin'){
            next();
        }else{
            return res.status(403).json({
                message: "Access denied admins only"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
}