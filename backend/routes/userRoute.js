import express from "express";
import { login, register, reVerify, verify, logout, forgetPassword, verifyOtp, changePassword, allUser, getUserById, updateUser, getProfile } from '../controllers/userController.js';
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verify);
router.post('/reverify/:email', reVerify);
router.post('/login', login);
router.post('/logout',isAuthenticated, logout);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp/:email', verifyOtp);
router.post('/change-password', changePassword);
router.get('/all-user', isAuthenticated, isAdmin, allUser);
router.get('/get-user/:userId', getUserById);
router.put('/update/:id', isAuthenticated, singleUpload, updateUser);
router.get('/profile', isAuthenticated, getProfile)

export default router;