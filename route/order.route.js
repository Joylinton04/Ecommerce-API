import express from "express";
import { placeOrderCOD } from "../controller/order.controller.js";
import {jwtCheck, verifyUser} from '../middleware/auth.middleware.js'

const orderRoute = express.Router()

//user features
orderRoute.post('/place', jwtCheck, verifyUser, placeOrderCOD)




export default orderRoute;