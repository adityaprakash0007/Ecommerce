import { Cart } from "../models/cartModels.js";
import { Product } from "../models/productModel.js";

// ✅ GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.productId");

    if (!cart) {
      return res.json({ success: true, cart: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    // 🔍 check product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🛒 find cart
    let cart = await Cart.findOne({ user: userId });

    // 🆕 create cart
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            productId,
            quantity: 1,
            price: product.productPrice,
          },
        ],
        totalPrice: product.productPrice,
      });
    } else {

      // 🔍 check item exists
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // ➕ increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // ➕ add new item
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

      // 🔄 recalc total
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    await cart.save();

    // 📦 populate before response
    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // ➕ ➖ quantity
    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    // 🔄 recalc total
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    cart = await cart.populate("items.productId");
    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};