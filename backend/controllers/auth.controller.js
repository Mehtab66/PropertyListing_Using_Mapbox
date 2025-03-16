const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Signup
module.exports.SignUp = async (req, res) => {
  const { email, password } = req.body;
console.log("Sign Up",email, password)
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('User ALready Exists')
      return res.status(400).json({ message: 'Please use another email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword)
    // Create user
    const user = new User({
      email, // Ensure this matches your model
      password: hashedPassword,
      role: "user"
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Optional: add token expiration
    );

    res.status(201).json({ token, user: { id: user._id, email, role: "user" } });
  } catch (error) {
    console.error('SignUp Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login
module.exports.Login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login",email, password)

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
      { expiresIn: '1h' } // Optional: add token expiration
    );

    res.json({ token, user: { id: user._id, email, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};