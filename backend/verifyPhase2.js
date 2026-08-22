require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Trip = require('./src/models/Trip');
const jwt = require('jsonwebtoken');

// We need the server running, but for this script we assume it's running locally on port 5000.
// If it's not running, we'll start the server logic here temporarily.
const express = require('express');
const app = express();
app.use(express.json());

// Mount the routes to test them internally
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/trips', require('./src/routes/tripRoutes'));
app.use('/api/destinations', require('./src/routes/destinationRoutes'));
app.use('/api/places', require('./src/routes/placeRoutes'));
app.use('/api/events', require('./src/routes/itineraryEventRoutes'));

let server;

async function runTests() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    server = app.listen(5001, () => console.log('Test Server running on 5001'));

    // Create mock user
    const user = new User({ name: 'API Tester', email: `api${Date.now()}@test.com`, password: 'pass' });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const api = axios.create({ baseURL: 'http://localhost:5001/api' });

    console.log('1. Testing POST /api/trips...');
    const tripRes = await api.post('/trips', { name: 'Test API Trip' }, config);
    const tripId = tripRes.data._id;
    console.log('Trip created via API:', tripId);

    console.log('2. Testing POST /api/destinations...');
    const destRes = await api.post('/destinations', { trip_id: tripId, city: 'London' }, config);
    const destId = destRes.data._id;
    console.log('Destination created via API:', destId);

    console.log('3. Testing POST /api/places...');
    const placeRes = await api.post('/places', { trip_id: tripId, destination_id: destId, name: 'Big Ben', category: 'Sightseeing' }, config);
    const placeId = placeRes.data._id;
    console.log('Place created via API:', placeId);

    console.log('4. Testing POST /api/events...');
    const eventRes = await api.post('/events', { trip_id: tripId, place_id: placeId, cost: 50 }, config);
    console.log('Event created via API:', eventRes.data._id);

    console.log('5. Testing GET /api/events...');
    const getEventsRes = await api.get(`/events/${tripId}`, config);
    console.log(`Fetched ${getEventsRes.data.length} events for trip.`);

    console.log('--- ALL API ROUTES TESTED SUCCESSFULLY! ---');

    // Cleanup
    await User.findByIdAndDelete(user._id);
    await Trip.findByIdAndDelete(tripId);
    await mongoose.connection.db.collection('destinations').deleteMany({ trip_id: tripId });
    await mongoose.connection.db.collection('places').deleteMany({ trip_id: tripId });
    await mongoose.connection.db.collection('itineraryevents').deleteMany({ trip_id: tripId });

  } catch (err) {
    console.error('API Test Failed:', err.response ? err.response.data : err.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
  }
}

runTests();
