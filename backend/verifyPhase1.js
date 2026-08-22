require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Trip = require('./src/models/Trip');
const Destination = require('./src/models/Destination');
const Place = require('./src/models/Place');
const ItineraryEvent = require('./src/models/ItineraryEvent');

async function testDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('1. Testing User...');
    const user = new User({ name: 'Test User', email: `test${Date.now()}@test.com`, password: 'password123' });
    await user.save();
    console.log('User saved:', user._id);

    console.log('2. Testing Trip...');
    const trip = new Trip({ user_id: user._id, name: 'Phase 1 Audit Trip', collaborators: [user._id] });
    await trip.save();
    console.log('Trip saved:', trip._id);

    console.log('3. Testing Destination...');
    const dest = new Destination({ trip_id: trip._id, city: 'Test City', location: { type: 'Point', coordinates: [12.49, 41.89] } });
    await dest.save();
    console.log('Destination saved:', dest._id);

    console.log('4. Testing Place...');
    const place = new Place({ trip_id: trip._id, destination_id: dest._id, name: 'Test Place', category: 'Sightseeing' });
    await place.save();
    console.log('Place saved:', place._id);

    console.log('5. Testing Itinerary Event...');
    const event = new ItineraryEvent({ trip_id: trip._id, place_id: place._id, date: new Date(), cost: 15 });
    await event.save();
    console.log('Event saved:', event._id);

    console.log('--- ALL PHASE 1 MODELS VERIFIED SUCCESSFULLY! ---');

    // Clean up
    console.log('Cleaning up test data...');
    await User.findByIdAndDelete(user._id);
    await Trip.findByIdAndDelete(trip._id);
    await Destination.findByIdAndDelete(dest._id);
    await Place.findByIdAndDelete(place._id);
    await ItineraryEvent.findByIdAndDelete(event._id);
    
    console.log('Cleanup complete. Closing connection.');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Audit failed:', err);
    process.exit(1);
  }
}

testDatabase();
