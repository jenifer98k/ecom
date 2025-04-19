/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL + "/api/admin";


const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Login Handler
  const onLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/login`, { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // Register Handler
  const onRegisterHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/register`, { email, password });
      if (response.data.success) {
        toast.success("Registration successful! You can now log in.");
        setIsRegistering(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // Forgot Password Handler
  const onForgotPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/forgot-password`, { email });
      if (response.data.success) {
        setOtpSent(true); // Indicate OTP was sent
        toast.success("OTP sent to your email!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Reset Password Handler
  const onResetPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/reset-password`, { email, otp, newPassword });
      if (response.data.success) {
        toast.success("Password reset successful! You can now log in.");
        setIsForgotPassword(false);
        setOtpSent(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {isRegistering ? "Register" : isForgotPassword ? "Forgot Password" : "Admin Panel"}
        </h1>

        {/* Forgot Password Form */}
        {isForgotPassword ? (
          <form onSubmit={otpSent ? onResetPasswordHandler : onForgotPasswordHandler}>
            <div className="mb-3 min-w-72">
              <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Show OTP & New Password Fields After OTP is Sent */}
            {otpSent && (
              <>
                <div className="mb-3 min-w-72">
                  <p className="text-sm font-medium text-gray-700 mb-2">Enter OTP</p>
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                    type="text"
                    placeholder="Enter OTP"
                    required
                  />
                </div>

                <div className="mb-3 min-w-72">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Password</p>
                  <input
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                    type="password"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </>
            )}

            <button className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black" type="submit">
              {otpSent ? "Reset Password" : "Send OTP"}
            </button>

            <p onClick={() => setIsForgotPassword(false)} className="text-sm text-center text-blue-500 cursor-pointer mt-3">
              Back to Login
            </p>
          </form>
        ) : (
          // Login / Register Form
          <form onSubmit={isRegistering ? onRegisterHandler : onLoginHandler}>
            <div className="mb-3 min-w-72">
              <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-3 min-w-72">
              <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black" type="submit">
              {isRegistering ? "Register" : "Login"}
            </button>

            {!isRegistering && (
              <p onClick={() => setIsForgotPassword(true)} className="mb-4 text-indigo-500 cursor-pointer">
                Forgot password?
              </p>
            )}
          </form>
        )}

        <p onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-center text-blue-500 cursor-pointer mt-3">
          {isRegistering ? "Already registered? Login here" : "No account? Register here"}
        </p>
      </div>
    </div>
  );
};

export default Login;
