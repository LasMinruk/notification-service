const request = require('supertest');
const app = require('../app');
const Notification = require('../models/Notification');

// Mock the entire Notification model so no real DB is needed
jest.mock('../models/Notification');

// ─────────────────────────────────────────────────────────
// Sample test data
// ─────────────────────────────────────────────────────────
const sampleNotification = {
  _id: '64f1a2b3c4d5e6f7a8b9c0d1',
  type: 'order_confirmation',
  orderId: 'order-123',
  userName: 'Alice Fernando',
  userEmail: 'alice@example.com',
  productName: 'Wireless Headphones',
  quantity: 2,
  totalPrice: 9000,
  message: 'Thank you Alice Fernando! Your order for 2x Wireless Headphones ($9000) has been confirmed.',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

const validPayload = {
  orderId: 'order-123',
  userName: 'Alice Fernando',
  userEmail: 'alice@example.com',
  productName: 'Wireless Headphones',
  quantity: 2,
  totalPrice: 9000
};

// ─────────────────────────────────────────────────────────
// GET /health
// ─────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.service).toBe('notification-service');
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────
// GET /notifications
// ─────────────────────────────────────────────────────────
describe('GET /notifications', () => {
  it('should return all notifications successfully', async () => {
    Notification.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([sampleNotification])
    });

    const res = await request(app).get('/notifications');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].orderId).toBe('order-123');
  });

  it('should return empty array when no notifications exist', async () => {
    Notification.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    });

    const res = await request(app).get('/notifications');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toHaveLength(0);
  });

  it('should return 500 when database throws an error', async () => {
    Notification.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('Database connection failed'))
    });

    const res = await request(app).get('/notifications');

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Database connection failed');
  });
});

// ─────────────────────────────────────────────────────────
// POST /notifications/order
// ─────────────────────────────────────────────────────────
describe('POST /notifications/order', () => {
  it('should create a notification successfully with valid data', async () => {
    Notification.create.mockResolvedValue(sampleNotification);

    const res = await request(app)
      .post('/notifications/order')
      .send(validPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Notification sent successfully');
    expect(res.body.data.orderId).toBe('order-123');
    expect(res.body.data.userName).toBe('Alice Fernando');
  });

  it('should return 400 when orderId is missing', async () => {
    const { orderId, ...missingOrderId } = validPayload;

    const res = await request(app)
      .post('/notifications/order')
      .send(missingOrderId);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please provide all required fields');
  });

  it('should return 400 when userName is missing', async () => {
    const { userName, ...missingUserName } = validPayload;

    const res = await request(app)
      .post('/notifications/order')
      .send(missingUserName);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please provide all required fields');
  });

  it('should return 400 when userEmail is missing', async () => {
    const { userEmail, ...missingEmail } = validPayload;

    const res = await request(app)
      .post('/notifications/order')
      .send(missingEmail);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please provide all required fields');
  });

  it('should return 400 when productName is missing', async () => {
    const { productName, ...missingProduct } = validPayload;

    const res = await request(app)
      .post('/notifications/order')
      .send(missingProduct);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please provide all required fields');
  });

  it('should return 400 when quantity is missing', async () => {
    const { quantity, ...missingQuantity } = validPayload;

    const res = await request(app)
      .post('/notifications/order')
      .send(missingQuantity);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please provide all required fields');
  });

  it('should return 400 when totalPrice is missing', async () => {
    const { totalPrice, ...missingPrice } = validPayload;

    const res = await request(app)
      .post('/notifications/order')
      .send(missingPrice);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please provide all required fields');
  });

  it('should return 400 when body is completely empty', async () => {
    const res = await request(app)
      .post('/notifications/order')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 500 when database throws an error', async () => {
    Notification.create.mockRejectedValue(new Error('DB write failed'));

    const res = await request(app)
      .post('/notifications/order')
      .send(validPayload);

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('DB write failed');
  });

  it('should generate correct confirmation message', async () => {
    const created = {
      ...sampleNotification,
      message: 'Thank you Alice Fernando! Your order for 2x Wireless Headphones ($9000) has been confirmed.'
    };
    Notification.create.mockResolvedValue(created);

    const res = await request(app)
      .post('/notifications/order')
      .send(validPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.message).toContain('Alice Fernando');
    expect(res.body.data.message).toContain('Wireless Headphones');
    expect(res.body.data.message).toContain('9000');
  });
});

// ─────────────────────────────────────────────────────────
// GET unknown route
// ─────────────────────────────────────────────────────────
describe('Unknown routes', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Route not found');
  });
});
