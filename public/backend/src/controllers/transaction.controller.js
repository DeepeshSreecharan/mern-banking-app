const Transaction = require('../models/TransactionModel');
const Account = require('../models/AccountModel');

const transactionController = {
  // Get user transactions (with pagination + filters)
  getTransactions: async (req, res) => {
    try {
      let { page = 1, limit = 10, type, startDate, endDate } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const account = await Account.findOne({ userId: req.userId });
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      // Build filter
      const filter = { accountId: account._id };

      if (type && type !== 'all') {
        filter.type = type.toLowerCase(); // ensure "credit"/"debit"
      }

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + 'T23:59:59.999Z'),
        };
      }

      const total = await Transaction.countDocuments(filter);

      const transactions = await Transaction.find(filter)
        .sort({ createdAt: -1 }) // newest first
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('fromAccount toAccount', 'accountNumber');

      res.json({
        transactions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalTransactions: total,
      });
    } catch (error) {
      console.error('❌ Error in getTransactions:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get transaction details
  getTransactionDetails: async (req, res) => {
    try {
      const { transactionId } = req.params;

      const transaction = await Transaction.findById(transactionId)
        .populate('fromAccount toAccount', 'accountNumber')
        .populate('userId', 'name email');

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Check if user owns this transaction
      if (transaction.userId._id.toString() !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json({ transaction });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get transaction statistics
  getTransactionStats: async (req, res) => {
    try {
      const { period = '30' } = req.query; // days

      const account = await Account.findOne({ userId: req.userId });
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const transactions = await Transaction.find({
        accountId: account._id,
        createdAt: { $gte: startDate },
      });

      const stats = {
        totalTransactions: transactions.length,
        totalCredits: 0,
        totalDebits: 0,
        creditCount: 0,
        debitCount: 0,
      };

      transactions.forEach((transaction) => {
        if (transaction.type === 'credit') {
          stats.totalCredits += transaction.amount;
          stats.creditCount++;
        } else {
          stats.totalDebits += transaction.amount;
          stats.debitCount++;
        }
      });

      // Monthly breakdown
      const monthlyData = {};
      transactions.forEach((transaction) => {
        const month = transaction.createdAt.toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { credits: 0, debits: 0 };
        }
        if (transaction.type === 'credit') {
          monthlyData[month].credits += transaction.amount;
        } else {
          monthlyData[month].debits += transaction.amount;
        }
      });

      res.json({ stats, monthlyData });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Download transaction statement
  downloadStatement: async (req, res) => {
    try {
      const { startDate, endDate, format = 'json' } = req.query;

      const account = await Account.findOne({ userId: req.userId });
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      const filter = { accountId: account._id };

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + 'T23:59:59.999Z'),
        };
      }

      const transactions = await Transaction.find(filter)
        .sort({ createdAt: -1 })
        .populate('fromAccount toAccount', 'accountNumber');

      if (format === 'csv') {
        // Generate CSV
        const csvHeaders = 'Date,Type,Amount,Description,Balance After,Status\n';
        const csvRows = transactions
          .map(
            (t) =>
              `${t.createdAt.toISOString().split('T')[0]},${t.type},${
                t.amount
              },"${t.description}",${t.balanceAfter || ''},${t.status}`
          )
          .join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=statement.csv'
        );
        res.send(csvHeaders + csvRows);
      } else {
        res.json({ transactions });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

module.exports = transactionController;
