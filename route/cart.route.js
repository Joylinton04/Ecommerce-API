import express from 'express'
import { addCart } from '../controller/cart.controller.js';
import { jwtCheck, verifyUser } from '../middleware/auth.middleware.js';

const cartRoute = express.Router()

cartRoute.post('/add', jwtCheck, verifyUser,addCart)


export default cartRoute;