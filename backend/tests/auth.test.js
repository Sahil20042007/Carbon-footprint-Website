const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // We'll need to modify server.js

describe('Authentication API Tests', () => {
  // Test database connection
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test 1: User Registration
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test${Date.now()}@example.com`, // Unique email
          password: 'test1234'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.name).toBe('Test User');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalidemail',
          password: 'test1234'
        });

      expect(response.statusCode).toBe(500); // Or 400 based on your validation
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123'
        });

      expect(response.statusCode).toBe(500);
    });
  });

  // Test 2: User Login
  describe('POST /api/auth/login', () => {
    let userEmail;
    let userPassword = 'test1234';

    beforeAll(async () => {
      // Create a user first
      userEmail = `testlogin${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: userEmail,
          password: userPassword
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userEmail,
          password: userPassword
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userEmail,
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(401);
    });
  });
});