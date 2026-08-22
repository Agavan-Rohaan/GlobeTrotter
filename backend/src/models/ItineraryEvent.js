const mongoose = require('mongoose');

const itineraryEventSchema = new mongoose.Schema({
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  date: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  cost: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' }
}, { timestamps: true });

module.exports = mongoose.model('ItineraryEvent', itineraryEventSchema);
