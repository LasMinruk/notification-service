const express = require('express');
const helmet = require('helmet');  
const app = express();

// Middleware
app.use(helmet());        
app.use(express.json());

// Import routes
const notificationRoutes = require('./routes/notificationRoutes');
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

// Handle unknown routes
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;