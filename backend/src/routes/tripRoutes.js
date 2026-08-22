const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

// Get all trips for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a trip
router.post('/', protect, async (req, res) => {
  const { name, description, startDate, endDate, coverPhoto } = req.body;
  try {
    const trip = new Trip({
      user_id: req.user._id,
      name,
      description,
      startDate,
      endDate,
      coverPhoto,
      collaborators: [req.user._id] // Owner is first collaborator
    });
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
