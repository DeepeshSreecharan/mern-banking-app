const User = require("../models/UserModel");

// Add money
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Amount must be > 0" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(user.accounts)) user.accounts = [];

    let account = user.accounts[0];
    if (!account) {
      account = {
        accountNumber: `AC${Date.now()}`,
        accountType: "savings",
        balance: 0,
      };
      user.accounts.push(account);
    }

    account.balance += amount;
    await user.save();

    return res.status(200).json({ message: `${amount} added successfully`, account });
  } catch (err) {
    console.error("Add money error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Deduct money
exports.deductMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Amount must be > 0" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(user.accounts)) user.accounts = [];

    let account = user.accounts[0];
    if (!account) return res.status(400).json({ message: "No account found" });
    if (account.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    account.balance -= amount;
    await user.save();

    return res.status(200).json({ message: `${amount} deducted successfully`, account });
  } catch (err) {
    console.error("Deduct money error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get balance
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(user.accounts)) user.accounts = [];

    let account = user.accounts[0];
    if (!account) {
      account = {
        accountNumber: `AC${Date.now()}`,
        accountType: "savings",
        balance: 0,
      };
      user.accounts.push(account);
      await user.save();
    }

    return res.status(200).json(account);
  } catch (err) {
    console.error("Get balance error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
