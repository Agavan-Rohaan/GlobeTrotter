const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

// Get all places (ideas) for a specific trip
router.get('/:tripId', protect, async (req, res) => {
  try {
    const places = await Place.find({ trip_id: req.params.tripId });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new place (Idea/Activity)
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

// Delete a place
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
