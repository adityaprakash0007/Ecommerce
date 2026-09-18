import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { Product } from "../models/productModel.js";

// ..............Add Product................
export const addProduct = async (req, res) => {
    try {
        const { productName, productDescription, productPrice, category, brand } = req.body;
        const userId = req.id;

        if (!productName || !productDescription || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products"
                });
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }
        // Create a product in DB
        const newProduct = await Product.create({
            userId,
            productName,
            productDescription,
            productPrice,
            category,
            brand,
            productImg
        });
        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// .....................All Products....................
export const getAllProduct = async (_, res) => {
    try {
        const products = await Product.find();

        // An empty list is a valid state, not an error — always return 200
        // so the frontend can distinguish "no products yet" from "request failed".
        return res.status(200).json({
            success: true,
            message: products.length === 0 ? "No products are available" : "Products fetched successfully",
            products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//....................Delete product..........
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//.......Update product...........
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDescription,
      productPrice,
      category,
      brand,
      existingImages
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let updatedImages = [];
    let keepIds = [];

    if (existingImages) {
      try {
        keepIds = JSON.parse(existingImages);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid existingImages format"
        });
      }

      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id)
      );

      // delete only removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id)
      );

      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }

    } else {
      updatedImages = product.productImg; // keep all if nothing sent
    }

    // upload new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products"
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    product.productName = productName || product.productName;
    product.productDescription =
      productDescription || product.productDescription;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};