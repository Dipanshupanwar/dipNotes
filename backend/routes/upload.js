// Inside routes/upload.js or your controller
const express = require('express');
const router = express.Router();
const UploadModel = require('../models/UploadModel'); // Mongoose schema

router.post('/upload', async (req, res) => {
  try {
    const uploadData = new UploadModel(req.body);
    await uploadData.save();
    res.status(201).json({ message: 'Upload successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
