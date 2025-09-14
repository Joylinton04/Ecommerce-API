// models/Cart.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false }); // Don't create an _id for subdocuments if not needed

const CartSchema = new Schema({
    user: {
        type: String,
        ref: 'User',
        required: false,
        unique: true,
    },
    items: [CartItemSchema], // Array of embedded cart items
    lastModified: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const cartModel = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
export default cartModel