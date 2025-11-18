import express from 'express'
import { addCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controller/cart.controller.js';
import { jwtCheck, verifyUser } from '../middleware/auth.middleware.js';

const cartRoute = express.Router()

cartRoute.post('/',getCart)
// cartRoute.post('/', jwtCheck, verifyUser,getCart)
cartRoute.post('/add', addCart)
cartRoute.post('/update', updateCartItem)
cartRoute.post('/clear', clearCart)
cartRoute.post('/remove', removeCartItem)


export default cartRoute;