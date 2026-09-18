    import sendEmail from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
    import User from "../models/userModel.js";
    import bcrypt from "bcrypt";
    import jwt from "jsonwebtoken";
    import sendOtpMail from "../emailVerify/sendOtp.js";
import cloudinary from "../utils/cloudinary.js";


        //   ........REGISTER.........
    export const register = async (req, res)=>{
        try { 
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        const verificationToken = jwt.sign(
            { id: newUser._id }, 
            process.env.SECRET_KEY, 
            { expiresIn: '1d' }
        );

          // ✅ Save verification token to user
        newUser.verificationToken = verificationToken;
        await newUser.save();
        
        // ✅ Send verification email
        await sendEmail(verificationToken, email);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });

      } catch (error) {
    console.error("REGISTER ERROR:", error); 
    return res.status(500).json({
        success: false,
        message: error.message
    });
}
    };
        //  ......VERIFY..........
   export const verify = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Add this — if already verified, return success
        if (user.isVerified) {
            return res.status(200).json({
                success: true,
                message: "Email verified successfully"
            });
        }

        // ✅ This now only runs on first click
        if (user.verificationToken !== token) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification token"
            });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification token"
        });
    }
};
//.........REVERIFY.........
export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified. You can login now."
            });
        }

        // Generate new verification token
        const verificationToken = jwt.sign(
            { id: user._id }, 
            process.env.SECRET_KEY, 
            { expiresIn: '1d' } // 24 hours
        );

        // Update user with new token
        user.verificationToken = verificationToken;
        await user.save();

        // Resend verification email
        await sendEmail(verificationToken, email);

        return res.status(200).json({
            success: true,
            message: "Verification email resent successfully. Please check your inbox."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
//...........LOGIN..........
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if fields are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        // Check if email is verified
        if (!existingUser.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        // Generate tokens
        const authToken = jwt.sign(
            { id: existingUser._id },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }
        );

        const refreshToken = jwt.sign(
            { id: existingUser._id },
            process.env.REFRESH_SECRET_KEY || process.env.SECRET_KEY,
            { expiresIn: '20d' }
        );

        // Handle session
        const existingSession = await Session.findOne({ userId: existingUser._id });
        if (existingSession) {
            await Session.deleteOne({ userId: existingUser._id });
        }
        await Session.create({ userId: existingUser._id });

        // ✅ Build a safe user object: include everything except sensitive fields,
        // so new schema fields (role, profilePic, etc.) are never accidentally dropped
        const userObj = existingUser.toObject();
        delete userObj.password;

        // ✅ Single response with full user object included
        return res.status(200).json({
            success: true,
            message: "You are logged in",
            token: authToken,
            refreshToken: refreshToken,
            user: userObj
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
//.........LOGOUT.........

export const logout = async (req, res)=>{
    try {
        const userId = req.userId;
        await Session.deleteMany({userId: userId});
        await User.findByIdAndUpdate(userId, {isLoggedIn: false});
        return res.status(200).json({
            success: true,
            message: "User logged out successfully."
        })
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message
       })  
    }
}
// ..........FORGET-PASSWORD..........
export const forgetPassword = async (req, res)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
          return res.status(400).json({
            success: false,
            message: "User not found!"
        })  
        }
        const otp = Math.floor(100000 + Math.random()*90000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000; 

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOtpMail(otp, email);

        return res.status(200).json({
            success: true,
            message: "Otp sent on your email!"
        })
    } catch (error) {
        
    }
}
//......verify-OTP...........
export const verifyOtp = async (req, res)=>{
    try {
       const {otp} = req.body;
       const {email} = req.params;
       if(!otp){
          return res.status(400).json({
            success: false,
            message: "Otp required"
        })
       }
       const user = await User.findOne({email});
       if(!user.otp || !user.otpExpiry){
        return res.status(400).json({
            success: false,
            message: "otp not generated or already verified"
        })
       }
       if(user.otpExpiry < new Date()){
        return res.status(400).json({
            success: false,
            message: 'Otp has expired please generate a new one.'
        })
       }
       if(otp !== user.otp){
          return res.status(400).json({
            success: false,
            message: 'Otp is invalid'
        })
       }
       user.otp = null;
       user.otpExpiry = null;
       await user.save();
       return res.status(200).json({
        success: true,
        message: 'Otp verified successfully.'
       })
    } catch (error) {
       return res.status(500).json({
        success: false,
        message: error.message
       })   
    }    
}
//.....change password...........
export const changePassword = async (req, res)=>{
    try {
       const {newPassword, confirmPassword} = req.body;
       const {email} = req.params;
       const user = await User.findOne({email});
       if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
       } 
       if(!newPassword || !confirmPassword){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
       }
       if(newPassword !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        })
       }
       const hashPassword = await bcrypt.hash(newPassword, 10);
       user.password = hashPassword;
       await user.save();
       return res.status(200).json({
        success: true,
        message: "Password changed successfully"
       })
    } catch (error) {
       return res.status(500).json({
        success: false,
        message: error.message
       })   
    }
}
//.......All user...............
export const allUser = async (_, res)=>{
    try {
        
    const users = await User.find({}).select('-password');
    return res.status(200).json({
        success: true,
        users
    })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })  
    }
}
//  .................UserById..............
export const getUserById = async (req, res) => { 
    try {
      const {userId} = req.params;
      const user = await User.findById(userId).select("-password -otp -otpExpiry -token");
      if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
      }  
      return res.status(200).json({
        success: true,
        user
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })  
    }
}

// .........GET PROFILE.........
export const getProfile = async (req, res) => {   // ✅ this is the new one
  try {
    const user = await User.findById(req.user._id).select("-password -otp -otpExpiry -verificationToken");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//........UpdateUser..............
export const updateUser = async (req, res)=>{
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user;
        const{firstName, lastName, address, city, zipCode, phoneNo, role} = req.body;
        if(loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin'){
          return res.status(403).json({
            success: false,
            message:"You are not allowed to update this profile"
          })
        } 

        let user = await User.findById(userIdToUpdate);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        // if a new file is upload
        if(req.file){
            if(profilePicPublicId){
                await cloudinary.uploader.destroy(profilePicPublicId)
            }
            const uploadResult = await new Promise((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    {folder: "profiles"},
                    (error, result)=>{
                        if(error) reject(error)
                            else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id
        }
        // update fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;
         if (loggedInUser.role === 'admin' && role) {
            user.role = role;
        }
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updateUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updateUser,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}