const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/sendOTP');

let otpStore = {}; // Temporary in-memory store (in production, use Redis or DB)

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily
    otpStore[email] = { otp, password, createdAt: Date.now() };

    // Send OTP via email
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: "No OTP found for this email" });

  const isExpired = Date.now() - record.createdAt > 5 * 60 * 1000; // 5 minutes
  if (isExpired) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(record.password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  delete otpStore[email];

  res.status(201).json({ message: "Signup successful" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
