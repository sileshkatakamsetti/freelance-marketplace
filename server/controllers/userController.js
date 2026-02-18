const User = require("../models/User");

/*
=========================================
GET FREELANCER EARNINGS
=========================================
*/
exports.getFreelancerEarnings = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // IMPORTANT: authMiddleware sets req.user._id
    const freelancer = await User.findById(req.user._id);

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.status(200).json({
      totalEarnings: freelancer.earnings || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
