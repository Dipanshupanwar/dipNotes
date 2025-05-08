import Feedback from '../models/FeedbackModel.js';

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, message, feedbackType } = req.body;

    const newFeedback = new Feedback({ name, email, rating, message, feedbackType });
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
};
