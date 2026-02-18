const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");

// ===============================
// FREELANCER REQUESTS WITHDRAWAL
// ===============================
exports.requestWithdrawal = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { amount } = req.body;

    const freelancer = await User.findById(req.user._id);

    if (amount > freelancer.earnings) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdrawal = await Withdrawal.create({
      freelancer: freelancer._id,
      amount,
    });

    res.status(201).json({
      message: "Withdrawal request submitted",
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// ADMIN APPROVES WITHDRAWAL (MOCK)
// ===============================
exports.approveWithdrawal = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const withdrawal = await Withdrawal.findById(req.params.id).populate(
      "freelancer"
    );

    if (!withdrawal || withdrawal.status === "approved") {
      return res.status(400).json({ message: "Invalid request" });
    }

    withdrawal.status = "approved";
    await withdrawal.save();

    // Reduce freelancer earnings
    withdrawal.freelancer.earnings -= withdrawal.amount;
    await withdrawal.freelancer.save();

    res.json({ message: "Withdrawal approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// ADMIN – GET ALL WITHDRAWALS
// ===============================
exports.getAllWithdrawals = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const withdrawals = await Withdrawal.find()
      .populate("freelancer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ withdrawals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// FREELANCER – GET OWN WITHDRAWALS
// ===============================
exports.getMyWithdrawals = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const withdrawals = await Withdrawal.find({
      freelancer: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ withdrawals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
