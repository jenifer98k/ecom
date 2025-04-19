import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

// function for add product
const addProduct = async (req, res) => {
  
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
 
   console.log( name,
    description,
    price,
    category,
    subCategory,
    sizes,
    bestseller);

   
   

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
    console.log(images);
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
        //   resource_type: "image",
        });
        return result.secure_url;
      })
    );
console.log(imagesUrl)
const parsedSizes = sizes ? JSON.parse(sizes) : []; // ✅ Minimal Fix
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: parsedSizes, // Use the fixed value here
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save(); 

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const ListProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    console.log("📥 Full Request Body:", req.body);  // ✅ Debugging incoming data

    // 1️⃣ Validate if `id` is present in request body
    const { id } = req.body;

    if (!id) {
      return res.json({ success: false, message: "❌ Product ID is required" });
    }

    // 2️⃣ Validate if `id` is a correct MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ success: false, message: "❌ Invalid product ID format" });
    }

    // 3️⃣ Find product in database
    const product = await productModel.findById(id);
    console.log("🔎 Product Found:", product);

    if (!product) {
      return res.json({ success: false, message: "❌ Product not found" });
    }

    // 4️⃣ Delete images from Cloudinary (optional)
    if (product.image && product.image.length > 0) {
      await Promise.all(
        product.image.map(async (imageUrl) => {
          try {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
            console.log(`🗑️ Deleted image: ${publicId}`);
          } catch (error) {
            console.error("⚠️ Error deleting image from Cloudinary:", error.message);
          }
        })
      );
    }

    // 5️⃣ Remove product from database
    await productModel.findByIdAndDelete(id);
    console.log("✅ Product Removed Successfully");

    res.json({ success: true, message: "✅ Product Removed Successfully" });

  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.json({ success: false, message: error.message });
  }
};






// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, ListProduct, removeProduct, singleProduct };