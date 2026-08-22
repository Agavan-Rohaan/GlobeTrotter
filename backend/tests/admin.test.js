require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Admin API Routes', () => {
  let adminToken, normalToken;
  let adminUser, normalUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    adminUser = new User({
      name: 'Jest Admin',
      email: `jestadmin${Date.now()}@test.com`,
      password: 'password',
      role: 'admin'
    });
    await adminUser.save();
    
    normalUser = new User({
      name: 'Jest Normal',
      email: `jestnormal${Date.now()}@test.com`,
      password: 'password',
      role: 'user'
    });
    await normalUser.save();

    adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    normalToken = jwt.sign({ id: normalUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  });

  afterAll(async () => {
    await User.findByIdAndDelete(adminUser._id);
    await User.findByIdAndDelete(normalUser._id);
    await mongoose.connection.close();
  });

  it('should block non-admin users from accessing stats with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${normalToken}`);
    
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Not authorized as an admin');
  });

  it('should allow admin users to access stats with 200 OK', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('trips');
    expect(res.body).toHaveProperty('destinations');
  });
});
