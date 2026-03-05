const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  sendOrderNotification
} = require('../controllers/notificationController');

router.get('/', getAllNotifications);           // GET /notifications
router.post('/order', sendOrderNotification);  // POST /notifications/order

module.exports = router;