import express from "express";
import { registerAdmin, adminLogin, forgotPassword, resetPassword } from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin); // Only 1st admin can register
router.post("/login", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
