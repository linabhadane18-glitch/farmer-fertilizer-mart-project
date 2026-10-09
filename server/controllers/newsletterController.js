const Newsletter = require('../models/Newsletter');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const existing = await Newsletter.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.json({
      success: true,
      message: 'You are already subscribed to our newsletter',
    });
  }

  await Newsletter.create({ email: email.toLowerCase() });

  res.status(201).json({
    success: true,
    message: 'Thank you for subscribing!',
  });
});

module.exports = { subscribe };
