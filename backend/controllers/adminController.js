import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "365d" });
};

// Register Admin (Only First User)
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({});

    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    // Send welcome email
    const msg = {
      to: email,
      from: process.env.ADMIN_EMAIL, 
      subject: "Welcome to Our Platform",
      text: `Hello Admin,\n\nWelcome to our system! Your account has been successfully created.\n\nRegards,\nTeam`,
      html: `<h3>Hello Admin,</h3><p>Welcome to our system! Your account has been successfully created.</p><p>Regards,<br>Team</p>`,
    };

    await sgMail.send(msg);

    res.status(201).json({ success: true, message: "Admin registered successfully. Welcome email sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(admin._id);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password - Send OTP
// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Generate OTP and expiry time
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    admin.otp = otp;
    admin.otpExpires = otpExpires;
    await admin.save();

    // Email content
    const msg = {
      to: email,
      from: process.env.ADMIN_EMAIL, 
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      html: `<h3>Your OTP for password reset is: <strong>${otp}</strong></h3><p>It is valid for 10 minutes.</p>`,
    };

    await sgMail.send(msg);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};




// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (!admin.otp || admin.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired or invalid" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (!admin.otp || admin.otpExpires < Date.now() || admin.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    await Admin.updateOne(
      { email },
      { $set: { password: hashedPassword, otp: null, otpExpires: null } }
    );

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





