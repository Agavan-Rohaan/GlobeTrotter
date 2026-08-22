const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE = 'https://overpass-api.de/api/interpreter';

// REQUIRED by Nominatim's usage policy: identify your app.
const OSM_HEADERS = {
  'User-Agent': 'GlobeTrotter-Hackathon/1.0 (contact: team@globetrotter.travel)'
};

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
// RATE LIMITER FOR NOMINATIM (1 req/sec ceiling)
// ---------------------------------------------------------------------------
let nominatimQueueTail = Promise.resolve();

function queueNominatimRequest(fn) {
  const result = nominatimQueueTail.then(async () => {
    const res = await fn();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return res;
  });
  nominatimQueueTail = result.catch(() => {});
  return result;
}

// ---------------------------------------------------------------------------
// ENDPOINT 1: City search (geocoding via Nominatim)
// GET /api/places/cities/search?q=Paris
// ---------------------------------------------------------------------------
router.get('/cities/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 2) {
    return res.json([]);
  }

  const cacheKey = `city:${q.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const url = new URL(`${NOMINATIM_BASE}/search`);
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '8');

    const data = await queueNominatimRequest(async () => {
      const r = await fetch(url.toString(), { headers: OSM_HEADERS });
      if (!r.ok) {
        throw new Error(`Nominatim responded ${r.status}`);
      }
      return r.json();
    });

    const cities = data
      .filter((place) =>
        ['city', 'town', 'village', 'administrative', 'state', 'county'].includes(
          place.addresstype || place.type
        )
      )
      .map((place) => ({
        name:
          place.address?.city ||
          place.address?.town ||
          place.address?.village ||
          place.name ||
          place.display_name.split(',')[0],
        country: place.address?.country || 'Unknown',
        displayName: place.display_name,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
      }));

    setCached(cacheKey, cities);
    res.json(cities);
  } catch (err) {
    console.error('[places/cities/search] error:', err.message);
    res.json([]);
  }
});

// ---------------------------------------------------------------------------
// ENDPOINT 2: Nearby places / things-to-do (Overpass API)
// GET /api/places/nearby?lat=48.8566&lng=2.3522&radius=5000
// ---------------------------------------------------------------------------
const CATEGORY_MAP = {
  attraction: 'Sightseeing',
  viewpoint: 'Sightseeing',
  artwork: 'Culture & Art',
  museum: 'Culture & Art',
  gallery: 'Culture & Art',
  monument: 'Culture & Art',
  memorial: 'Culture & Art',
  theme_park: 'Amusement & Parks',
  zoo: 'Amusement & Parks',
  park: 'Amusement & Parks',
  garden: 'Amusement & Parks',
  restaurant: 'Food & Dining',
  cafe: 'Food & Dining',
  fast_food: 'Food & Dining'
};

function normalizeCategory(tags) {
  const raw =
    tags.tourism || tags.historic || tags.leisure || tags.amenity || 'attraction';
  return CATEGORY_MAP[raw] || 'Sightseeing';
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
  const cacheKey = `nearby:${roundedLat}:${roundedLng}:${radius}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const query = `
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|museum|viewpoint|artwork|gallery|theme_park|zoo"](around:${radius},${lat},${lng});
      node["historic"~"monument|memorial|castle|ruins"](around:${radius},${lat},${lng});
      node["leisure"~"park|garden"](around:${radius},${lat},${lng});
      node["amenity"~"restaurant|cafe"](around:${radius},${lat},${lng});
    );
    out body 40;
  `;

  try {
    const r = await fetch(OVERPASS_BASE, {
      method: 'POST',
      headers: {
        ...OSM_HEADERS,
        'Content-Type': 'text/plain'
      },
      body: query
    });

    if (!r.ok) {
      throw new Error(`Overpass responded ${r.status}`);
    }

    const data = await r.json();

    const places = data.elements
      .filter((el) => el.tags && el.tags.name)
      .map((el) => ({
        id: `osm-${el.id}`,
        name: el.tags.name,
        category: normalizeCategory(el.tags),
        lat: el.lat,
        lng: el.lon
      }))
      .slice(0, 30);

    setCached(cacheKey, places);
    res.json(places);
  } catch (err) {
    console.error('[places/nearby] error:', err.message);
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
