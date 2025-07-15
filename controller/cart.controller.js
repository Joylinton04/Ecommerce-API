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

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      const newCartItem = {
        user: userId,
        item: [
          {
            product: productId,
            quantity: quantity,
            price: product.price,
          },
        ],
      };
      const newCart = new cartModel(newCartItem);
      await newCart.save();

    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product === productId
      );
      if (itemIndex > -1) {
        // update the quantity if the item exist
        cart.items[itemIndex].quantity += 1;

        if (cart.items[itemIndex].quantity > product.stock) {
          return res.status(400).json({
            message: `Cannot add more than ${product.stock} of ${product.name} to cart.`,
          });
        }
      }
    }

    cart.lastModified = Date.now();
    await cart.save();

    res.status(200).json({ sucess: true, cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
