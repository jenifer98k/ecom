import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  isVerified: { type: Boolean, default: false } // To track email verification
});

// export default mongoose.model("Admin", adminSchema);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;