const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createReview,
  getFreelancerReviews,
} = require("../controllers/reviewController");

/* =====================================
   CLIENT CREATE REVIEW
===================================== */
router.post("/", auth, createReview);

/* =====================================
   FREELANCER VIEW REVIEWS
===================================== */
router.get("/freelancer", auth, getFreelancerReviews);

module.exports = router;
