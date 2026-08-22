const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

const GEOAPIFY_KEY = '25a9bf719b2f4498af3127866d28febf';
const GEOAPIFY_GEOCODE_URL = 'https://api.geoapify.com/v1/geocode/search';
const GEOAPIFY_PLACES_URL = 'https://api.geoapify.com/v2/places';

// ---------------------------------------------------------------------------
// SIMPLE IN-MEMORY CACHE
// ---------------------------------------------------------------------------
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ---------------------------------------------------------------------------
// ENDPOINT 1: City search (Geocoding via Geoapify API)
// GET /api/places/cities/search?q=Paris
// ---------------------------------------------------------------------------
router.get('/cities/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const cacheKey = `city:geoapify:${q.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const url = `${GEOAPIFY_GEOCODE_URL}?text=${encodeURIComponent(q)}&format=json&limit=8&apiKey=${GEOAPIFY_KEY}`;
    const r = await fetch(url);
    if (!r.ok) {
      throw new Error(`Geoapify responded ${r.status}`);
    }
    const data = await r.json();

    const cities = (data.results || []).map((place) => ({
      name: place.city || place.name || place.formatted.split(',')[0],
      country: place.country || 'Unknown',
      displayName: place.formatted,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    }));

    setCached(cacheKey, cities);
    res.json(cities);
  } catch (err) {
    console.error('[places/cities/search] Geoapify error:', err.message);
    res.json([]);
  }
});

// ---------------------------------------------------------------------------
// ENDPOINT 2: Nearby places / things-to-do (Geoapify Places API)
// GET /api/places/nearby?lat=48.8566&lng=2.3522&radius=5000
// ---------------------------------------------------------------------------
function mapGeoapifyCategory(categories = []) {
  const catsStr = categories.join(',').toLowerCase();
  if (catsStr.includes('catering') || catsStr.includes('restaurant') || catsStr.includes('cafe')) {
    return 'Food & Dining';
  }
  if (catsStr.includes('leisure') || catsStr.includes('park') || catsStr.includes('entertainment')) {
    return 'Amusement & Parks';
  }
  if (catsStr.includes('heritage') || catsStr.includes('museum') || catsStr.includes('art')) {
    return 'Culture & Art';
  }
  return 'Sightseeing';
}

router.get('/nearby', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radius = parseInt(req.query.radius, 10) || 5000;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ message: 'lat and lng query params are required and must be numbers' });
  }

  const roundedLat = lat.toFixed(3);
  const roundedLng = lng.toFixed(3);
  const cacheKey = `nearby:geoapify:${roundedLat}:${roundedLng}:${radius}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const url = `${GEOAPIFY_PLACES_URL}?categories=tourism,catering,entertainment,leisure,commercial&filter=circle:${lng},${lat},${radius}&limit=30&apiKey=${GEOAPIFY_KEY}`;
    const r = await fetch(url);

    if (!r.ok) {
      throw new Error(`Geoapify Places responded ${r.status}`);
    }

    const data = await r.json();

    const places = (data.features || [])
      .filter((feat) => feat.properties && feat.properties.name)
      .map((feat, idx) => ({
        id: `geoapify-${feat.properties.place_id || idx}`,
        name: feat.properties.name,
        category: mapGeoapifyCategory(feat.properties.categories || []),
        lat: feat.geometry.coordinates[1],
        lng: feat.geometry.coordinates[0]
      }))
      .slice(0, 30);

    setCached(cacheKey, places);
    res.json(places);
  } catch (err) {
    console.error('[places/nearby] Geoapify error:', err.message);
    res.json([]);
  }
});

// ---------------------------------------------------------------------------
// EXISTING MONGODB CRUD ROUTES
// ---------------------------------------------------------------------------
router.get('/:tripId', protect, async (req, res) => {
  try {
    const places = await Place.find({ trip_id: req.params.tripId });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  const { trip_id, destination_id, category, name, address, coordinates, images, website, notes } = req.body;
  
  try {
    const trip = await Trip.findOne({ _id: trip_id, user_id: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const place = new Place({
      trip_id,
      destination_id,
      category,
      name,
      address,
      coordinates,
      images,
      website,
      notes
    });

    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: 'Place removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
