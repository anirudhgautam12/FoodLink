import Rating from '../models/Rating.js';
import User from '../models/User.js';

// @desc    Add a rating for a user
// @route   POST /api/ratings
// @access  Private
export const addRating = async (req, res) => {
  try {
    const { toUserId, score, comment } = req.body;

    // Prevent rating oneself
    if (req.user._id.toString() === toUserId) {
      return res.status(400).json({ message: 'You cannot rate yourself' });
    }

    const rating = await Rating.create({
      fromUserId: req.user._id,
      toUserId,
      score,
      comment
    });

    // Update user's average rating
    const userRatings = await Rating.find({ toUserId });
    const avgRating = userRatings.reduce((acc, item) => acc + item.score, 0) / userRatings.length;

    await User.findByIdAndUpdate(toUserId, { rating: avgRating });

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
