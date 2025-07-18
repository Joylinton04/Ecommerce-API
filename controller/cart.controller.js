import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

export const addCart = async (req, res) => {
  //   let cart;
  const userId = req.user;
  const { productId, quantity } = req.body;
  if (!productId || !quantity)
    return res.json({ sucess: false, message: "Invalid product details" });

  try {
    const product = await productModel.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ sucess: false, message: "Product not found!" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      const newCartItem = {
        user: userId,
        items: [
          {
            productId: productId,
            quantity: quantity,
            price: product.price,
          },
        ],
      };
      cart = new cartModel(newCartItem);
      await cart.save();
      return res.status(201).json({ success: true, cart: cart });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId == productId);
    if (itemIndex > -1) {
      // Product exists — update quantity
      const newQuantity = cart.items[itemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than ${product.stock} of ${product.name} to cart.`,
        });
      }

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Product not in cart — push new item
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: product.price,
      });
    }

    cart.lastModified = Date.now();
    await cart.save();

    return res.status(200).json({ success: true, cart: cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
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

    const itemIndex = cart.items.findIndex((item) => item.productId == productId);

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
    const cart = await cartModel.findOne({ user: userId})
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId == productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.lastModified = Date.now()
    await cart.save()

    res.status(200).json({success: true, message: "Cart item removed successfully", cart})


  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

};
