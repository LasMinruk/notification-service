const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import routes - fixed path to point to correct location
const notificationRoutes = require('../routes/notificationRoutes');

// Mount routes
app.use('/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'notification-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Handle unknown routes - using regex pattern for catch-all
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
