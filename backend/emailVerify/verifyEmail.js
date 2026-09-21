import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

 
const sendEmail = async (token, email) => {
  try {
    const verificationLink = `http://localhost:5173/verify/${token}`;
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
      subject: "email verification",
      text: `Hi there, you have recently visited out website and entered your email.Please follow the given link to verify the email ${verificationLink}`
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email error:", error.message);
  }
};

export default sendEmail;