const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  semester: String,
  department: String,
  driveLink: String,
  description: String,
  type: String, // to store route param (notes, labs, etc.)
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Upload', uploadSchema);
