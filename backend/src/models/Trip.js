const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  coverPhoto: { type: String }, // Dropbox URL
  isPublic: { type: Boolean, default: false },
  status: { type: String, enum: ['Planning', 'Ongoing', 'Completed'], default: 'Planning' }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
