const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Signup: send OTP
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password); // Log to ensure data is being received
  
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Generate OTP and hash the password
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Send OTP to email
    await sendEmail(email, "Verify your email", `Your OTP is ${otp}`);

    // Save new user
    await User.create({
      email,
      password: hashedPassword,
      otp,
     otpExpires: new Date(Date.now() + 10 * 60 * 1000)
    });

    res.json({ msg: "OTP sent to your email!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }
  
      // 🧪 Debugging OTP issues
      console.log("Stored OTP:", user.otp);
      console.log("Entered OTP:", otp);
      console.log("Current Time:", Date.now());
      console.log("OTP Expiry Time:", user.otpExpires);
  
      // Check if OTP is valid or expired
      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
      }
  
      // Clear OTP after successful verification
      user.otp = null;
      user.otpExpires = null;
      await user.save();
  
      res.json({ msg: "Signup successful" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  });
  

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ msg: "Login successful", token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});



// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'No user found with this email' });
    }

    // Generate reset token (using crypto module)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save the token in the database with expiration time (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Send the reset link to the user's email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail(email, 'Password Reset Request', `Click the link to reset your password: ${resetUrl}`);
    
    res.json({ msg: 'Password reset link has been sent to your email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      // Find the user by the reset token and check if it's expired
      const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired reset token' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      user.resetPasswordToken = undefined; // Clear the reset token
      user.resetPasswordExpires = undefined; // Clear the expiration time
  
      await user.save();
  
      res.json({ msg: 'Your password has been successfully reset' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  






module.exports = router;
