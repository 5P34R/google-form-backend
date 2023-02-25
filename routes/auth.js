const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: 'Authentication failed' });
      }
      if (isMatch) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.json({ token });
      }
      return res.status(401).json({ message: 'Authentication failed' });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Login failed' });
  }
});

module.exports = router;
