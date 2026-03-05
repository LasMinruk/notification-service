const notifications = require('../data/notifications');

// GET /notifications - Get all notifications
const getAllNotifications = (req, res) => {
  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
};

// POST /notifications/order - Send order notification
const sendOrderNotification = (req, res) => {
  const { orderId, userName, userEmail, productName, quantity, totalPrice } = req.body;

  if (!orderId || !userName || !userEmail || !productName || !quantity || !totalPrice) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  const notification = {
    id: `notif-${Date.now()}`,
    type: 'order_confirmation',
    orderId,
    userName,
    userEmail,
    productName,
    quantity,
    totalPrice,
    message: `Thank you ${userName}! Your order for ${quantity}x ${productName} ($${totalPrice}) has been confirmed.`,
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);

  console.log(`📧 Notification sent to ${userEmail}: ${notification.message}`);

  res.status(201).json({
    success: true,
    message: 'Notification sent successfully',
    data: notification
  });
};

module.exports = { getAllNotifications, sendOrderNotification };

