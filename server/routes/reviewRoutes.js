const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviewsByGig,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

/*
========================================
POST REVIEW (Protected)
========================================
*/
router.post("/", protect, createReview);

/*
========================================
GET REVIEWS BY GIG ID (Public)
========================================
*/
router.get("/:gigId", getReviewsByGig);

module.exports = router;
