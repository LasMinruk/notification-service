const app = require('./src/app');

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`✅ Notification Service is running on port ${PORT}`);
  console.log(`📍 Health check:          http://localhost:${PORT}/health`);
  console.log(`🔔 Notifications endpoint: http://localhost:${PORT}/notifications`);
});