const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const Account = require('../models/AccountModel');
const { generateToken } = require('../utils/jwt.service');
const { sendWelcomeEmail } = require('../utils/mailer');

const authController = {
  // ✅ Register a new user
  register: async (req, res) => {
    try {
      const { name, email, phone, password, dateOfBirth, address } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        dateOfBirth,
        address,
        role: 'customer'
      });

      await user.save();

      // Create savings account for the user
      const accountNumber = 'CBI' + Date.now() + Math.floor(Math.random() * 1000);
      const account = new Account({
        userId: user._id,
        accountNumber,
        accountType: 'savings',
        balance: 1000,
        status: 'active'
      });

      await account.save();

      // Send welcome email (optional, ignore if mailer not set up)
      try {
        await sendWelcomeEmail(user.email, user.name, accountNumber);
      } catch (err) {
        console.log("Email send error (ignored):", err.message);
      }

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          accountNumber,
          balance: account.balance
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // ✅ Login existing user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Get user's account
      const account = await Account.findOne({ userId: user._id });

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          accountNumber: account?.accountNumber,
          balance: account?.balance || 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // ✅ Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      const account = await Account.findOne({ userId: req.userId });

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          accountNumber: account?.accountNumber,
          balance: account?.balance || 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // ✅ Update profile
  updateProfile: async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { name, phone, address },
        { new: true }
      ).select('-password');

      res.json({
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController;
