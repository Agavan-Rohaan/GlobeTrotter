const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

// Get all destinations for a specific trip
router.get('/:tripId', protect, async (req, res) => {
  try {
    // Optional: Verify user owns the trip
    const trip = await Trip.findOne({ _id: req.params.tripId, user_id: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const destinations = await Destination.find({ trip_id: req.params.tripId }).sort({ order: 1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new destination (Stop)
router.post('/', protect, async (req, res) => {
  const { trip_id, city, country, location, arrivalDate, departureDate, scrapedDescription, order } = req.body;
  
  try {
    const trip = await Trip.findOne({ _id: trip_id, user_id: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const destination = new Destination({
      trip_id,
      city,
      country,
      location,
      arrivalDate,
      departureDate,
      scrapedDescription,
      order
    });

    const savedDest = await destination.save();
    res.status(201).json(savedDest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update a destination
router.put('/:id', protect, async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destination not found' });

    // Ensure ownership via trip
    const trip = await Trip.findOne({ _id: dest.trip_id, user_id: req.user._id });
    if (!trip) return res.status(401).json({ message: 'Unauthorized' });

    const updatedDest = await Destination.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedDest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a destination
router.delete('/:id', protect, async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destination not found' });

    const trip = await Trip.findOne({ _id: dest.trip_id, user_id: req.user._id });
    if (!trip) return res.status(401).json({ message: 'Unauthorized' });

    await Destination.findByIdAndDelete(req.params.id);
    // Note: In a production system, we'd also cascade delete Places and Events tied to this destination
    res.json({ message: 'Destination removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
