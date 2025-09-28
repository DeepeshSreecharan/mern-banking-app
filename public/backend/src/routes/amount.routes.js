const express = require("express");
const path = require("path");
const router = express.Router();

// Use path.join for reliable module resolution
const { addMoney, deductMoney, getBalance } = require(path.join(__dirname, "..", "controllers", "amount.controller"));
const { authMiddleware, adminMiddleware } = require(path.join(__dirname, "..", "middlewares", "auth.middleware"));

// Add money
router.post("/add", authMiddleware, addMoney);

// Deduct money
router.post("/deduct", authMiddleware, deductMoney);

// Get balance
router.get("/balance", authMiddleware, getBalance);

module.exports = router;
