const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  rating: Number,
  message: String,
  feedbackType: String
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
