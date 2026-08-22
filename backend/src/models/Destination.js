const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  city: { type: String, required: true },
  country: { type: String },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] } // [longitude, latitude]
  },
  scrapedDescription: { type: String }, // Saved from our scraper
  arrivalDate: { type: Date },
  departureDate: { type: Date },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Create geospatial index
destinationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Destination', destinationSchema);
