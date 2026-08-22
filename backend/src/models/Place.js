const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  destination_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }, // Null if general trip idea
  category: { type: String, enum: ['Sightseeing', 'Food', 'Accommodation', 'Transport', 'Note', 'Other'], default: 'Other' },
  name: { type: String, required: true },
  address: { type: String },
  coordinates: { type: [Number] }, // [longitude, latitude]
  images: [{ type: String }], // Dropbox URLs
  website: { type: String },
  notes: { type: String } // User's personal thoughts
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);
