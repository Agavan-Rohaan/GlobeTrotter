const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

// Get all trips for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a trip
router.post('/', protect, async (req, res) => {
  const { name, description, startDate, endDate, stops } = req.body;
  try {
    const trip = new Trip({
      user: req.user._id,
      name,
      description,
      startDate,
      endDate,
      stops: stops || []
    });
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
