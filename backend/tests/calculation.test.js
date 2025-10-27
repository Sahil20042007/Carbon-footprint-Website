const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Calculation API Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Register and login a user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Calc Test User',
        email: `calctest${Date.now()}@example.com`,
        password: 'test1234'
      });

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test 1: Create Calculation
  describe('POST /api/calculation', () => {
    it('should create calculation with valid data', async () => {
      const calculationData = {
        transportation: {
          carKm: 100,
          carType: 'petrol',
          publicTransportKm: 50,
          flightShortHaul: 2,
          flightLongHaul: 1
        },
        homeEnergy: {
          electricityKwh: 100,
          naturalGasKwh: 50,
          heatingOil: 0,
          renewableEnergy: false
        },
        food: {
          meatFrequency: 'weekly',
          dairyFrequency: 'daily',
          localFood: true,
          organicFood: false
        },
        shopping: {
          clothingItemsPerMonth: 3,
          electronicsPerYear: 2,
          onlineOrdersPerMonth: 5,
          secondHand: false
        },
        waste: {
          recycling: true,
          composting: false,
          plasticUsage: 'medium'
        }
      };

      const response = await request(app)
        .post('/api/calculation')
        .set('Authorization', `Bearer ${authToken}`)
        .send(calculationData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('results');
      expect(response.body.data.results).toHaveProperty('total');
      expect(response.body.data.results.total).toBeGreaterThan(0);
    });

    it('should fail without authentication token', async () => {
      const response = await request(app)
        .post('/api/calculation')
        .send({});

      expect(response.statusCode).toBe(401);
    });
  });

  // Test 2: Get All Calculations
  describe('GET /api/calculation', () => {
    it('should get all calculations for authenticated user', async () => {
      const response = await request(app)
        .get('/api/calculation')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/calculation');

      expect(response.statusCode).toBe(401);
    });
  });

  // Test 3: Calculation Accuracy
  describe('Calculation Logic', () => {
    it('should calculate carbon footprint correctly', async () => {
      const simpleData = {
        transportation: {
          carKm: 100,
          carType: 'petrol',
          publicTransportKm: 0,
          flightShortHaul: 0,
          flightLongHaul: 0
        },
        homeEnergy: {
          electricityKwh: 0,
          naturalGasKwh: 0,
          heatingOil: 0,
          renewableEnergy: false
        },
        food: {
          meatFrequency: 'never',
          dairyFrequency: 'never',
          localFood: false,
          organicFood: false
        },
        shopping: {
          clothingItemsPerMonth: 0,
          electronicsPerYear: 0,
          onlineOrdersPerMonth: 0,
          secondHand: false
        },
        waste: {
          recycling: false,
          composting: false,
          plasticUsage: 'low'
        }
      };

      const response = await request(app)
        .post('/api/calculation')
        .set('Authorization', `Bearer ${authToken}`)
        .send(simpleData);

      // 100 km * 0.192 (petrol car) = 19.2 kg
      expect(response.body.data.results.transportation).toBeCloseTo(19.2, 1);
    });
  });
});