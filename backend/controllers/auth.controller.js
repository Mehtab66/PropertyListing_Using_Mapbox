const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup

module.exports.SignUp=async(req,res)=>{

const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
    );

    res.status(201).json({ token, user: { id: user._id, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }

}
// Login

module.exports.Login=async(req,res)=>{
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

module.exports = router;