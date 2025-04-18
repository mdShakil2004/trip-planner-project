const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  start: String,
  destination: String,
  date: Date,
  travelers: Number,
  stops: [{ name: String, url: String }], // Array of stops
  preferences: {
    fastest: Boolean,
    scenic: Boolean,
    avoidTolls: Boolean,
    avoidHighways: Boolean,
    restStops: Boolean,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalDistance: String, // Optional: Add if you want to store distance
  travelTime: String, // Optional: Add if you calculate this
  driveTime: String, // Optional: Add if you calculate this
});

const TripData = mongoose.model('TripData', tripSchema);

module.exports = { TripData };