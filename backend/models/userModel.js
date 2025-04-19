import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  otp: { type: String }, // Add OTP field
  otpExpires: { type: Date }, // Add OTP expiry field
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;