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
            product: productId,
            quantity: quantity,
            price: product.price,
          },
        ],
      };
      cart = new cartModel(newCartItem);
      await cart.save();
      return res.status(201).json({ success: true, cart: cart });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product === productId
    );
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
        product: productId,
        quantity: quantity,
        price: product.price,
      });
    }

    cart.lastModified = Date.now();
    await cart.save();
    console.log(cart)

    return res.status(200).json({ success: true, cart: cart });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
