const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { welcomeEmail, passwordResetEmail } = require('../services/emailTemplates');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, authProvider: 'local' });

  sendEmail({ to: user.email, subject: 'Welcome to Fortify', html: welcomeEmail(user.name) }).catch((err) =>
    console.error('Welcome email failed:', err.message)
  );

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Incorrect email or password');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// GET /api/auth/google  and  GET /api/auth/google/callback
// Wired up via passport in routes/authRoutes.js — on success this issues a
// JWT and redirects back to the client with it as a query param, e.g.
// `${CLIENT_URL}/auth/callback?token=...`
const googleCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No account found with that email');
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Your Fortify password reset code',
    html: passwordResetEmail(otp),
  });

  res.json({ message: 'Reset code sent to your email' });
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordOtp +resetPasswordExpires');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset code');
  }

  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset — please sign in' });
});

module.exports = { register, login, googleCallback, getMe, forgotPassword, resetPassword };
