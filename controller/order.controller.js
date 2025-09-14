import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

// store product id and use populate method to get the entire data on the backend
// either than sending the entire cart items from the frontend
// store the price from the cart items

// Cash on delivery
export const placeOrderCOD = async (req, res) => {
  const userId = req.user;
  const { shippingAddress, paymentMethod, cartItems } = req.body;

  if (!shippingAddress || !paymentMethod || !cartItems)
    return res.status(400).json({
      success: false,
      message:
        "Missing required order information (shipping address, payment method, or cart items).",
    });

  if (paymentMethod !== "Cash on Delivery") {
    return res.status(400).json({
      success: false,
      message:
        "Invalid payment method for this endpoint. Expected 'Cash on Delivery'.",
    });
  }

  let orderItems = [];
  let subTotal = 0;

  try {
    for (const item of cartItems) {
      const { productId, quantity } = item;
      if (!productId || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID or quantity in cart items.",
        });
      }

      //   validate product
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      //  use price from cart maybe later :(

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
        });
      }

      orderItems.push({
        productId: productId,
        quantity: quantity,
        price: product.price,
      });

      subTotal += product.price * quantity;
    }

    const shippingPrice = 5.0;
    // const taxRate = 0.05;
    const totalPrice = subTotal + shippingPrice;

    const newOrderData = {
      user: userId,
      items: orderItems,
      shippingAddress: shippingAddress,
      paymentMethod: "Cash on Delivery",
      isPaid: false,
      isDelivered: false,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      orderStatus: "Pending",
    };

    const order = new orderModel(newOrderData);
    // clear cart
    // decrement stock

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of orderItems) {
        // Find the product and update its stock
        await productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { session } // Apply the update within the transaction session
        );
      }

      order.lastModified = Date.now();
      await order.save({ session }); // Save the new order within the transaction

      await cartModel.deleteOne({ user: userId }, { session }); //clear cart

      await session.commitTransaction(); // Commit changes if all successful
      session.endSession();

      return res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        order: order,
      });
    } catch (transactionError) {
      await session.abortTransaction(); // Rollback changes if any error occurs
      session.endSession();
      console.error(
        "Transaction failed during order placement:",
        transactionError
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to finalize order due to a database error. Please try again.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// user order history
export const orderHistory = async (req, res) => {
  const userId = req.user;
  if (!userId)
    return res
      .status(404)
      .json({ success: false, message: "No user Id token found" });

  try {
    const orders = await orderModel.find({ user: userId });
    res.status(200).json({ success: true, orders: orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Internal Error" });
  }
};

// cancel order
export const cancelOrder = async (req, res) => {
  const userId = req.user;
  const { orderId } = req.body;
  if (!orderId)
    return res
      .status(400)
      .json({ success: false, message: "Invalid order ID" });

  try {
    const order = await orderModel.findOne({ _id: orderId });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "No order found" });

    let cartItems = order.items;

    const newCart = {
      user: userId,
      items: cartItems,
    };

    const cart = new cartModel(newCart);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Restore stock for each item in the order
      for (const item of cartItems) {
        await productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      await cart.save({ session });
      await orderModel.deleteOne({ _id: orderId }, { session });
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction failed during order cancellation:", err);
      return res.status(500).json({
        success: false,
        message:
          "Failed to cancel order due to a database error. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "cancelled order successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Internal Error" });
  }
};

// handle orderStatus
export const handleOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status)
    return res.status(400).json({
      success: false,
      message: "Order ID and status are required.",
    });

  try {
    const order = await orderModel.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });

    order.orderStatus = status;
    order.lastModified = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: order,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
