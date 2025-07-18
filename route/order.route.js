import express from "express";
import {
  cancelOrder,
  handleOrderStatus,
  orderHistory,
  placeOrderCOD,
} from "../controller/order.controller.js";
import { jwtCheck, verifyUser } from "../middleware/auth.middleware.js";

const orderRoute = express.Router();

//user features
orderRoute.post("/place", jwtCheck, verifyUser, placeOrderCOD);
orderRoute.post("/history", jwtCheck, verifyUser, orderHistory);
orderRoute.post("/cancel", jwtCheck, verifyUser, cancelOrder);
orderRoute.post("/status", jwtCheck, verifyUser, handleOrderStatus);

export default orderRoute;
