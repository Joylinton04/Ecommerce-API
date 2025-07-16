import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the schema for individual items within an order
const OrderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
}, { _id: false });

// Define the main Order Schema
const OrderSchema = new Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    items: [OrderItemSchema], // Array of embedded order item documents
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: [
            'Pending',      // Initial state, awaiting payment or confirmation
            'Processing',   // Payment confirmed, order being prepared
            'Shipped',      // Order has left the warehouse/seller
            'Delivered',    // Order has reached the customer
            'Cancelled',    // Order cancelled by customer or admin
            'Refunded',     // Order refunded
            'On Hold'       // Specific issue needs attention
        ],
        default: 'Pending',
        required: true
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
});

const orderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default orderModel;