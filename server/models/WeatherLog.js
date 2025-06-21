const mongoose = require('mongoose');

const WeatherLogSchema = new mongoose.Schema({
  city: String,
  temp: Number,
  description: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WeatherLog', WeatherLogSchema);
