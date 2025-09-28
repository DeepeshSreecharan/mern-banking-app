const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', transactionController.getTransactions);
router.get('/stats', transactionController.getTransactionStats);
router.get('/download', transactionController.downloadStatement);
router.get('/:transactionId', transactionController.getTransactionDetails);

module.exports = router;