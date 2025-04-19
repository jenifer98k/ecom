import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded Token:", token_decode);

    req.adminId = token_decode.id; // Store admin ID in req
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};


export default adminAuth;