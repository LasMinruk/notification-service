const Notification = require('../models/Notification');

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendOrderNotification = async (req, res) => {
  try {
    const { orderId, userName, userEmail, productName, quantity, totalPrice } = req.body;

    if (!orderId || !userName || !userEmail || !productName || !quantity || !totalPrice)
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });

    const message = `Thank you ${userName}! Your order for ${quantity}x ${productName} ($${totalPrice}) has been confirmed.`;

    const notification = await Notification.create({
      type: 'order_confirmation',
      orderId,
      userName,
      userEmail,
      productName,
      quantity,
      totalPrice,
      message
    });

    console.log(`📧 Notification saved for ${userEmail}: ${message}`);

    res.status(201).json({ success: true, message: 'Notification sent successfully', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllNotifications, sendOrderNotification };