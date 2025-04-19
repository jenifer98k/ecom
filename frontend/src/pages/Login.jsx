/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const backendUrl = "http://localhost:4000/api/user"; // Update this if needed
axios.defaults.withCredentials = true;

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/"); // Redirect if already logged in
    }
  }, []);

  // ✅ Login Handler
// ✅ Login Handler
const onLoginHandler = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  try {
    const res = await axios.post(
      `${backendUrl}/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    if (res.data.success && res.data.token) {
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/"); // Redirect after login
    } else {
      toast.error(res.data.message || "Invalid credentials. Try again.");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};



  // ✅ Forgot Password Handler (Send OTP)
  const onForgotPasswordHandler = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email!");

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/forgot-password`, { email });
      if (response.data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Password Handler
  const onResetPasswordHandler = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("Please fill all fields!");

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/reset-password`, { email, otp, newPassword });
      if (response.data.success) {
        toast.success("Password reset successful! You can log in now.");
        setIsForgotPassword(false); // Switch back to login form
        setOtpSent(false); // Reset OTP state
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {isForgotPassword ? "Forgot Password" : "Login"}
        </h1>

        {/* Forgot Password Form */}
        {isForgotPassword ? (
          <form onSubmit={otpSent ? onResetPasswordHandler : onForgotPasswordHandler}>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Show OTP & New Password Fields After OTP is Sent */}
            {otpSent && (
              <>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter OTP"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
              {otpSent ? "Reset Password" : "Send OTP"}
            </button>

            <p onClick={() => setIsForgotPassword(false)} className="text-sm text-blue-500 text-center mt-3 cursor-pointer">
              Back to Login
            </p>
          </form>
        ) : (
          // Login Form
          <form onSubmit={onLoginHandler}>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
              {loading ? "Logging in..." : "Login"}
            </button>

            <p onClick={() => setIsForgotPassword(true)} className="text-sm text-blue-500 text-center mt-3 cursor-pointer">
              Forgot password?
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
