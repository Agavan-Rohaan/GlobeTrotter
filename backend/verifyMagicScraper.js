const request = require('supertest');
const app = require('./src/index');
const mongoose = require('mongoose');
require('dotenv').config();

async function runTest() {
  const dummyTripId = new mongoose.Types.ObjectId();
  
  console.log('Testing POST /api/scrape/magic-build for Paris...');
  
  const res = await request(app)
    .post('/api/scrape/magic-build')
    .send({ query: 'Paris', tripId: dummyTripId });
    
  console.log('Status Code:', res.status);
  console.log('Response Body:', JSON.stringify(res.body, null, 2));
  
  if (res.status === 201) {
    // Clean up DB
    const Place = require('./src/models/Place');
    await Place.deleteMany({ trip_id: dummyTripId });
    console.log('✅ Endpoint works perfectly and places were saved and cleaned up!');
  } else {
    console.error('❌ Endpoint failed.');
  }

  process.exit(0);
}

runTest();
