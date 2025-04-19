import mongoose from "mongoose";
import "dotenv/config"; // Ensures env variables are loaded
import Admin from "../models/adminModel.js"; // Ensure the correct path

// Connect to the database before all tests
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
});

// Clear the database before each test
beforeEach(async () => {
  console.time("dropCollection"); // Start a timer
  await Admin.collection.drop(); // Drop the entire collection
  console.timeEnd("dropCollection"); // End the timer and log the time
}, 30000); // Increase timeout to 30000 ms (30 seconds)

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test for Admin Registration
describe("Admin Registration", () => {
  it("should register a new admin", async () => {
    const adminData = {
      email: "jeniferalbatross@gmail.com",
      password: "12345678",
    };

    try {
      const newAdmin = new Admin(adminData);
      await newAdmin.save();

      const savedAdmin = await Admin.findOne({ email: adminData.email });
      console.log(savedAdmin); // Log the saved admin to debug

      // Check if the admin was saved correctly
      expect(savedAdmin).toBeTruthy();
      expect(savedAdmin.email).toBe(adminData.email);
      expect(savedAdmin.password).toBe(adminData.password);
      expect(savedAdmin.otp).toBeNull(); // Default value
      expect(savedAdmin.otpExpires).toBeNull(); // Default value
      expect(savedAdmin.isVerified).toBe(false); // Default value
    } catch (error) {
      console.error("Error saving admin:", error); // Log any errors
      throw error; // Re-throw the error to fail the test
    }
  });

  it("should verify OTP for an admin", async () => {
    const adminData = {
      email: "jeniferalbatross@gmail.com",
      password: "12345678",
      otp: "123456", // Simulate OTP
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    };

    // Save the admin with OTP
    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    // Simulate OTP verification
    const savedAdmin = await Admin.findOne({ email: adminData.email });
    savedAdmin.isVerified = true; // Mark as verified
    savedAdmin.otp = null; // Clear OTP after verification
    savedAdmin.otpExpires = null; // Clear OTP expiration after verification
    await savedAdmin.save();

    // Check if the admin is verified and OTP fields are cleared
    const verifiedAdmin = await Admin.findOne({ email: adminData.email });
    console.log(verifiedAdmin); // Log the verified admin to debug

    expect(verifiedAdmin.isVerified).toBe(true);
    expect(verifiedAdmin.otp).toBeNull(); // OTP should be cleared
    expect(verifiedAdmin.otpExpires).toBeNull(); // OTP expiration should be cleared
  });
});