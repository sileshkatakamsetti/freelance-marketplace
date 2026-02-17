const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAdminDashboard,
  getAllUsers,
  toggleBlockUser,
  getAllGigsAdmin,
  deleteGigAdmin,
  getAllOrdersAdmin,
} = require("../controllers/adminController");

// Dashboard
router.get("/dashboard", authMiddleware, getAdminDashboard);

// User management
router.get("/users", authMiddleware, getAllUsers);
router.put("/users/:userId/block", authMiddleware, toggleBlockUser);

// Gig management
router.get("/gigs", authMiddleware, getAllGigsAdmin);
router.delete("/gigs/:gigId", authMiddleware, deleteGigAdmin);

// Order monitoring ✅
router.get("/orders", authMiddleware, getAllOrdersAdmin);

module.exports = router;
