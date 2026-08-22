require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
app.use(express.json());
app.use('/api/admin', require('./src/routes/adminRoutes'));

let server;

async function runTests() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    server = app.listen(5002, () => console.log('Test Server running on 5002'));

    // Create an Admin user
    const adminUser = new User({ name: 'Super Admin', email: `admin${Date.now()}@test.com`, password: 'pass', role: 'admin' });
    await adminUser.save();
    
    // Create a Normal user
    const normalUser = new User({ name: 'Normal User', email: `normal${Date.now()}@test.com`, password: 'pass', role: 'user' });
    await normalUser.save();

    const adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    const normalToken = jwt.sign({ id: normalUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    const api = axios.create({ baseURL: 'http://localhost:5002/api' });

    console.log('1. Testing GET /api/admin/stats with Admin Token...');
    const statsRes = await api.get('/admin/stats', { headers: { Authorization: `Bearer ${adminToken}` } });
    console.log('Success! Stats returned:', statsRes.data);

    console.log('2. Testing GET /api/admin/stats with Normal Token (Should Fail)...');
    try {
      await api.get('/admin/stats', { headers: { Authorization: `Bearer ${normalToken}` } });
      throw new Error('This should have failed with 403!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log('Success! Normal user was blocked with 403 Forbidden.');
      } else {
        throw err;
      }
    }

    console.log('--- ALL PHASE 3 ROUTES TESTED SUCCESSFULLY! ---');

    // Cleanup
    await User.findByIdAndDelete(adminUser._id);
    await User.findByIdAndDelete(normalUser._id);

  } catch (err) {
    console.error('API Test Failed:', err.response ? err.response.data : err.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
  }
}

runTests();
