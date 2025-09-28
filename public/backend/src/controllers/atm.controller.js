const ATMCard = require('../models/ATMModel');
const Account = require('../models/AccountModel');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

const atmController = {
  // Request new ATM card
  requestCard: async (req, res) => {
    try {
      const { cardType, deliveryAddress } = req.body;

      // Check if user already has an active card
      const existingCard = await ATMCard.findOne({ 
        userId: req.userId, 
        status: { $in: ['active', 'requested'] }
      });

      if (existingCard) {
        return res.status(400).json({ message: 'You already have an active or pending ATM card' });
      }

      // Generate card number
      const cardNumber = '4532' + Date.now().toString().slice(-12);
      
      // Generate CVV
      const cvv = Math.floor(100 + Math.random() * 900).toString();

      // Set expiry date (3 years from now)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);

      const atmCard = new ATMCard({
        userId: req.userId,
        cardNumber,
        expiryDate,
        cvv,
        cardType,
        deliveryAddress,
        status: 'requested'
      });

      await atmCard.save();

      res.status(201).json({
        message: 'ATM Card requested successfully',
        card: {
          id: atmCard._id,
          cardNumber: `****-****-****-${cardNumber.slice(-4)}`,
          cardType: atmCard.cardType,
          status: atmCard.status,
          requestDate: atmCard.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get user's ATM cards
  getCards: async (req, res) => {
    try {
      const cards = await ATMCard.find({ userId: req.userId }).sort({ createdAt: -1 });
      
      const safeCards = cards.map(card => ({
        id: card._id,
        cardNumber: `****-****-****-${card.cardNumber.slice(-4)}`,
        cardType: card.cardType,
        status: card.status,
        expiryDate: card.expiryDate,
        requestDate: card.createdAt,
        isBlocked: card.isBlocked
      }));

      res.json({ cards: safeCards });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Set ATM PIN
  setPin: async (req, res) => {
    try {
      const { cardId, pin, confirmPin } = req.body;

      if (pin !== confirmPin) {
        return res.status(400).json({ message: 'PIN and confirm PIN do not match' });
      }

      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        return res.status(400).json({ message: 'PIN must be 4 digits' });
      }

      const card = await ATMCard.findOne({ _id: cardId, userId: req.userId });
      if (!card) {
        return res.status(404).json({ message: 'ATM Card not found' });
      }

      // Hash PIN
      const hashedPin = await bcrypt.hash(pin, 12);
      card.pin = hashedPin;
      card.pinSet = true;
      
      // Activate card if it was just delivered
      if (card.status === 'delivered') {
        card.status = 'active';
      }

      await card.save();

      res.json({
        message: 'PIN set successfully',
        cardStatus: card.status
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Change ATM PIN
  changePin: async (req, res) => {
    try {
      const { cardId, oldPin, newPin, confirmNewPin } = req.body;

      if (newPin !== confirmNewPin) {
        return res.status(400).json({ message: 'New PIN and confirm PIN do not match' });
      }

      if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        return res.status(400).json({ message: 'PIN must be 4 digits' });
      }

      const card = await ATMCard.findOne({ _id: cardId, userId: req.userId });
      if (!card) {
        return res.status(404).json({ message: 'ATM Card not found' });
      }

      // Verify old PIN
      const isPinValid = await bcrypt.compare(oldPin, card.pin);
      if (!isPinValid) {
        return res.status(400).json({ message: 'Invalid old PIN' });
      }

      // Hash new PIN
      const hashedPin = await bcrypt.hash(newPin, 12);
      card.pin = hashedPin;
      await card.save();

      res.json({ message: 'PIN changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Block/Unblock ATM card
  toggleBlockCard: async (req, res) => {
    try {
      const { cardId } = req.params;
      const { action } = req.body; // 'block' or 'unblock'

      const card = await ATMCard.findOne({ _id: cardId, userId: req.userId });
      if (!card) {
        return res.status(404).json({ message: 'ATM Card not found' });
      }

      card.isBlocked = action === 'block';
      await card.save();

      res.json({
        message: `Card ${action}ed successfully`,
        isBlocked: card.isBlocked
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get card details for dashboard
  getCardDetails: async (req, res) => {
    try {
      const { cardId } = req.params;
      const card = await ATMCard.findOne({ _id: cardId, userId: req.userId });
      
      if (!card) {
        return res.status(404).json({ message: 'ATM Card not found' });
      }

      res.json({
        id: card._id,
        cardNumber: card.cardNumber, // Full number only for detailed view
        cardType: card.cardType,
        expiryDate: card.expiryDate,
        cvv: card.cvv,
        status: card.status,
        isBlocked: card.isBlocked,
        pinSet: card.pinSet
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = atmController;