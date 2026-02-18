const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  requestWithdrawal,
  approveWithdrawal,
  getAllWithdrawals,
  getMyWithdrawals,
} = require("../controllers/withdrawalController");

// Freelancer requests withdrawal
router.post("/request", authMiddleware, requestWithdrawal);

// Freelancer views own withdrawal history
router.get("/my", authMiddleware, getMyWithdrawals);

// Admin views all withdrawals
router.get("/", authMiddleware, getAllWithdrawals);

// Admin approves withdrawal
router.put("/:id/approve", authMiddleware, approveWithdrawal);

module.exports = router;
