const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temp: Number,
  description: String,
  icon: String,
  searchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Search", searchSchema);
