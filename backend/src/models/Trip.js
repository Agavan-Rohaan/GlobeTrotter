const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coverPhoto: { type: String }, // URL
  stops: [{
    city: { type: String, required: true },
    date: { type: Date, required: true },
    activities: [{
      name: { type: String, required: true },
      time: { type: String },
      cost: { type: Number, default: 0 }
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
