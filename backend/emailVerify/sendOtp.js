import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

 
const sendOtpMail = async (otp, email) => {
  try {
    const verificationLink = `http://localhost:8000/api/auth/verify/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password reset otp",
      html: `<p>Your otp for password reset is:<b>${otp}</b> </p>`
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");

  } catch (error) {
    console.log("Email error:", error.message);
  }
};

export default sendOtpMail;