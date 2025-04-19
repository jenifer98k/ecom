import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import mongoose from "mongoose";
// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// CORS Configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://shiplify.in"]
    : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Use Admin Routes
// Use Admin Routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});


if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log("Server started on PORT : " + port));
}
// app.listen(port, () => console.log("Server started on PORT : " + port));