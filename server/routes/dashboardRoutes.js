const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  clientDashboard,
  freelancerDashboard,
} = require("../controllers/dashboardController");

/*
=========================================
CLIENT DASHBOARD ROUTE
=========================================
*/
router.get("/client", protect, clientDashboard);

/*
=========================================
FREELANCER DASHBOARD ROUTE
=========================================
*/
router.get("/freelancer", protect, freelancerDashboard);

module.exports = router;
