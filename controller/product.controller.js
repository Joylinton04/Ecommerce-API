import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCateory,
      sizes,
      bestSeller,
      date,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];

    const images = [image1, image2].filter((item) => item !== undefined);

    let imageUrls = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    const newProduct = {
      name,
      description,
      price,
      category,
      subCateory,
      sizes,
      bestSeller: bestSeller == "true" ? true : false,
      date: Date.now(),
      image: imageUrls,
    };

    const product = new productModel(newProduct);
    await product.save();

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const listProduct = async (req, res) => {
  try {
    const allProducts = await productModel.find();
    res.status(200).json({ success: true, allProducts });
  } catch (err) {
    console.log(err);
  }
};

export const singleProduct = async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing ID" });
  }

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing ID" });
  }
  try {
    const delProduct = await productModel.findByIdAndDelete(id);
    if (!delProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    category,
    subCateory,
    sizes,
    bestSeller,
    date,
  } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Invalid or missing ID" });
  }

  try {
    // Handle file uploads
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const images = [image1, image2].filter(Boolean);

    let imageUrls = [];

    if (images.length) {
      imageUrls = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    // Build update object
    const updateFields = {
      name,
      description,
      price,
      category,
      subCateory,
      sizes,
      bestSeller,
      date,
    };

    // Optionally include image URLs if available
    if (imageUrls.length) {
      updateFields.image = imageUrls; // Make sure your schema supports this
    }
    
    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(id, updateFields, {
      new: true, // Return the updated document
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: updatedProduct });

  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

