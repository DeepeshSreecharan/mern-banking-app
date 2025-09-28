const FixedDeposit = require('../models/FixedDepositModel');
const Account = require('../models/AccountModel');
const Transaction = require('../models/TransactionModel');

const fdController = {
  // Create new FD
  createFD: async (req, res) => {
    try {
      const { amount, tenure } = req.body;

      if (amount < 1000) {
        return res.status(400).json({ message: 'Minimum FD amount is ₹1000' });
      }

      // Check account balance
      const account = await Account.findOne({ userId: req.userId });
      if (!account || account.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Calculate interest rate
      let interestRate;
      if (tenure <= 12) interestRate = 6.5;
      else if (tenure <= 24) interestRate = 7.0;
      else if (tenure <= 36) interestRate = 7.5;
      else interestRate = 8.0;

      // Calculate maturity amount
      const maturityAmount = amount * Math.pow(1 + interestRate / 100, tenure / 12);

      // Create FD (ensure status is active)
      const fd = new FixedDeposit({
        userId: req.userId,
        accountId: account._id,
        amount,
        tenure,
        interestRate,
        maturityAmount,
        startDate: new Date(),
        maturityDate: new Date(Date.now() + tenure * 30 * 24 * 60 * 60 * 1000),
        status: 'active'
      });

      await fd.save();

      // Deduct amount from account
      account.balance -= amount;
      await account.save();

      // Create transaction
      const transaction = new Transaction({
        userId: req.userId,
        accountId: account._id,
        type: 'debit',
        amount,
        description: `Fixed Deposit created - FD ID: ${fd._id}`,
        status: 'completed'
      });
      await transaction.save();

      res.status(201).json({
        message: 'Fixed Deposit created successfully',
        fd: {
          id: fd._id,
          amount: fd.amount,
          tenure: fd.tenure,
          interestRate: fd.interestRate,
          maturityAmount: fd.maturityAmount,
          startDate: fd.startDate,
          maturityDate: fd.maturityDate,
          status: fd.status
        }
      });
    } catch (error) {
      console.error('Create FD error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get all FDs for user
  getFDs: async (req, res) => {
    try {
      const fds = await FixedDeposit.find({ userId: req.userId }).sort({ createdAt: -1 });

      res.json({
        fds: fds.map(fd => ({
          id: fd._id,
          amount: fd.amount,
          tenure: fd.tenure,
          interestRate: fd.interestRate,
          maturityAmount: fd.maturityAmount,
          startDate: fd.startDate,
          maturityDate: fd.maturityDate,
          status: fd.status
        }))
      });
    } catch (error) {
      console.error('Get FDs error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get FD details
  getFDDetails: async (req, res) => {
    try {
      const { fdId } = req.params;
      const fd = await FixedDeposit.findOne({ _id: fdId, userId: req.userId });

      if (!fd) {
        return res.status(404).json({ message: 'Fixed Deposit not found' });
      }

      // Calculate current value
      const daysPassed = Math.floor((new Date() - fd.startDate) / (1000 * 60 * 60 * 24));
      const totalDays = fd.tenure * 30;
      const currentValue = fd.amount + (fd.maturityAmount - fd.amount) * (daysPassed / totalDays);

      res.json({
        fd: {
          id: fd._id,
          amount: fd.amount,
          tenure: fd.tenure,
          interestRate: fd.interestRate,
          maturityAmount: fd.maturityAmount,
          startDate: fd.startDate,
          maturityDate: fd.maturityDate,
          status: fd.status
        },
        currentValue: Math.max(fd.amount, currentValue),
        daysPassed,
        daysRemaining: Math.max(0, totalDays - daysPassed)
      });
    } catch (error) {
      console.error('Get FD details error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Break FD (premature withdrawal)
  breakFD: async (req, res) => {
    try {
      const { fdId } = req.params;
      const fd = await FixedDeposit.findOne({ _id: fdId, userId: req.userId });

      if (!fd) {
        return res.status(404).json({ message: 'Fixed Deposit not found' });
      }

      if (fd.status !== 'active') {
        return res.status(400).json({ message: 'FD is not active' });
      }

      // Calculate penalty (1% lower rate)
      const daysPassed = Math.floor((new Date() - fd.startDate) / (1000 * 60 * 60 * 24));
      const penaltyRate = fd.interestRate - 1;
      const timeRatio = daysPassed / (fd.tenure * 30);
      const penaltyAmount = fd.amount * Math.pow(1 + penaltyRate / 100, timeRatio);

      // Update account balance
      const account = await Account.findById(fd.accountId);
      account.balance += penaltyAmount;
      await account.save();

      // Update FD
      fd.status = 'broken';
      fd.actualMaturityAmount = penaltyAmount;
      await fd.save();

      // Create transaction
      const transaction = new Transaction({
        userId: req.userId,
        accountId: account._id,
        type: 'credit',
        amount: penaltyAmount,
        description: `FD Broken - Premature withdrawal: ${fd._id}`,
        status: 'completed'
      });
      await transaction.save();

      res.json({
        message: 'Fixed Deposit broken successfully',
        amountCredited: penaltyAmount,
        newBalance: account.balance
      });
    } catch (error) {
      console.error('Break FD error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = fdController;
