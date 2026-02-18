const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getFreelancerEarnings,
} = require("../controllers/userController");

router.get(
  "/freelancer/earnings",
  authMiddleware,
  getFreelancerEarnings
);

module.exports = router;
