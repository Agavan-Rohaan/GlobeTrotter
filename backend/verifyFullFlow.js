const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

async function runTest() {
  console.log('--- Starting E2E Backend Verification ---');
  try {
    // 1. Register User
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'Password123!';
    console.log(`\n1. Registering user ${email}...`);
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email,
      password
    });
    const token = regRes.data.token;
    console.log('   Γ£à User registered successfully. Token received.');

    // Setup Axios instance with token
    const client = axios.create({
      baseURL: API_URL,
      headers: { Authorization: `Bearer ${token}` }
    });

    // 2. Create Trip
    console.log('\n2. Creating a new trip...');
    const tripRes = await client.post('/trips', {
      name: 'Backend E2E Test Trip',
      description: 'Testing the full data flow.',
      startDate: '2026-10-01',
      endDate: '2026-10-10'
    });
    const tripId = tripRes.data._id;
    console.log(`   Γ£à Trip created. ID: ${tripId}`);

    // 3. Create Destinations
    console.log('\n3. Adding Destinations...');
    const dest1 = await client.post('/destinations', {
      trip_id: tripId,
      city: 'Rome',
      country: 'Italy',
      arrivalDate: '2026-10-01',
      departureDate: '2026-10-05',
      order: 0
    });
    console.log('   Γ£à Destination 1 added (Rome)');
    
    // 4. Create Place & Event
    console.log('\n4. Creating a Place and tying it to an Event...');
    const placeRes = await client.post('/places', {
      trip_id: tripId,
      destination_id: dest1.data._id,
      name: 'Colosseum',
      category: 'Sightseeing',
      coordinates: [12.4922, 41.8902],
    });
    const placeId = placeRes.data._id;
    console.log(`   Γ£à Place created. ID: ${placeId}`);

    const eventRes = await client.post('/events', {
      trip_id: tripId,
      place_id: placeId,
      date: '2026-10-02T00:00:00.000Z',
      startTime: '2026-10-02T09:00:00.000Z',
      endTime: '2026-10-02T12:00:00.000Z',
      cost: 20,
      currency: 'USD'
    });
    console.log('   Γ£à Event created and tied to trip.');

    // 5. Fetch everything back to ensure it loads
    console.log('\n5. Verifying retrieval endpoints...');
    const getTrip = await client.get(`/trips/${tripId}`);
    console.log(`   Γ£à Fetched Trip: ${getTrip.data.name}`);
    
    const getEvents = await client.get(`/events/${tripId}`);
    console.log(`   Γ£à Fetched ${getEvents.data.length} Events for Trip.`);
    if (getEvents.data.length > 0) {
        console.log(`      -> Event 0: ${getEvents.data[0].place_id.name} at ${getEvents.data[0].startTime}`);
    }

    console.log('\nΓ£à Backend is fully operational and data flows correctly.');

  } catch (error) {
    console.error('\nΓ¥î Test failed:');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runTest();
