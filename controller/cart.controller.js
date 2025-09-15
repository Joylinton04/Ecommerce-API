import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

export const addCart = async (req, res) => {
  const userId = req.user;
  const { items } = req.body; // Expecting: { items: [{ productId, quantity, size }, ...] }


  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid cart payload" });
  }

  try {
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    for (const { productId, quantity, size } of items) {
      if (!productId || !quantity) continue; // skip invalid item

      const product = await productModel.findById(productId);
      if (!product) continue; // skip if product not found

      // Parse sizes since you stored it as stringified array
      const availableSizes = product.sizes ? JSON.parse(product.sizes) : [];

      if (size && !availableSizes.includes(size)) {
        return res.status(400).json({
          success: false,
          message: `Size ${size} not available for ${product.name}`,
        });
      }

      // Check stock
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      // See if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId.toString() &&
          item.size === size
      );

      if (itemIndex > -1) {
        // Update existing item quantity
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more than ${product.stock} of ${product.name}`,
          });
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          quantity,
          size,
          price: product.price,
        });
      }
    }

    cart.lastModified = Date.now();
    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user;

  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Not cart found" });

    res.status(200).json({ success: true, cart: cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  const userId = req.user;
  const { productId, quantity } = req.body;

  if (!productId || !quantity)
    return res.json({ sucess: false, message: "Invalid product details" });

  try {
    const product = await productModel.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );

    if (itemIndex > -1) {
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than ${product.stock} of ${product.name} to cart.`,
        });
      }

      cart.items[itemIndex].quantity = quantity;
      cart.lastModified = Date.now();
      await cart.save();
      res.status(200).json({ success: true, cart: cart });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  // const
};

export const removeCartItem = async (req, res) => {
  // get info from req
  const userId = req.user;
  const { productId } = req.body;

  try {
    // find cart
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    cart.lastModified = Date.now();
    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Cart item removed successfully", cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
