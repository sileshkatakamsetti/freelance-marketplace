const Review = require("../models/Review");
const Order = require("../models/Order");

/* =====================================
   CLIENT SUBMIT REVIEW
===================================== */
exports.createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating || !comment) {
      return res.status(400).json({ message: "All fields required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only client of the order
    if (order.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only after completion
    if (order.status !== "completed") {
      return res.status(400).json({ message: "Order not completed yet" });
    }

    // Prevent duplicate review
    const existing = await Review.findOne({ order: orderId });
    if (existing) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    const review = await Review.create({
      order: order._id,
      client: req.user.id,
      freelancer: order.freelancer, // 🔥 CRITICAL
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================
   FREELANCER VIEW REVIEWS
===================================== */
exports.getFreelancerReviews = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const reviews = await Review.find({
      freelancer: req.user.id, // 🔥 THIS FIXES YOUR ISSUE
    })
      .populate("client", "name")
      .populate("order", "price");

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
