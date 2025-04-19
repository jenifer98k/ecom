import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/forgot-password", forgotPassword); // Forgot password route
userRouter.post("/verify-otp", verifyOTP); // Verify OTP route
userRouter.post("/reset-password", resetPassword); // Reset password route


export default userRouter;