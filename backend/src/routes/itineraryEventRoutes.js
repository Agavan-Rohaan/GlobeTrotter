const express = require('express');
const router = express.Router();
const ItineraryEvent = require('../models/ItineraryEvent');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

// Get all events for a specific trip (Calendar View)
router.get('/:tripId', protect, async (req, res) => {
  try {
    const events = await ItineraryEvent.find({ trip_id: req.params.tripId })
      .populate('place_id') // Populate the actual Place details
      .sort({ startTime: 1, date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new event (Scheduling a Place on the Calendar)
router.post('/', protect, async (req, res) => {
  const { trip_id, place_id, date, startTime, endTime, cost, currency } = req.body;
  
  try {
    const trip = await Trip.findOne({ _id: trip_id, user_id: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const event = new ItineraryEvent({
      trip_id,
      place_id,
      date,
      startTime,
      endTime,
      cost,
      currency
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
