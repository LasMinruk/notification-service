const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'order_confirmation' },
    orderId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);