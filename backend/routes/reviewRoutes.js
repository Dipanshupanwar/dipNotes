const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST a review
router.post('/', async (req, res) => {
  try {
    const { name, rating, review } = req.body;
    const newReview = new Review({ name, rating, review });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
