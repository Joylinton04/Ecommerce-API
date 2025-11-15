import express from 'express'
import { addCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controller/cart.controller.js';
import { jwtCheck, verifyUser } from '../middleware/auth.middleware.js';

const cartRoute = express.Router()

cartRoute.post('/',getCart)
// cartRoute.post('/', jwtCheck, verifyUser,getCart)
cartRoute.post('/add', jwtCheck, verifyUser,addCart)
cartRoute.post('/update', jwtCheck, verifyUser, updateCartItem)
cartRoute.post('/clear', jwtCheck, verifyUser, clearCart)
cartRoute.post('/remove', jwtCheck, verifyUser, removeCartItem)


export default cartRoute;