// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const FeedbackModel = require('../models/FeedbackModel');

router.post('/', async (req, res) => {
  try {
    const { name, email, rating, message, feedbackType } = req.body;
    const feedback = new FeedbackModel({ name, email, rating, message, feedbackType });
    await feedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Error saving feedback' });
  }
});

module.exports = router;
