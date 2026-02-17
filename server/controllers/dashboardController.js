const Order = require("../models/Order");
const Gig = require("../models/Gig");

/*
=========================================
CLIENT DASHBOARD
=========================================
GET /api/dashboard/client
*/
exports.clientDashboard = async (req, res) => {
  try {
    // 🔒 Role check
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 📦 Fetch client orders
    const orders = await Order.find({ client: req.user._id })
      .populate("gig", "title price")
      .populate("freelancer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      role: "client",
      totalOrders: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Client dashboard error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
FREELANCER DASHBOARD
=========================================
GET /api/dashboard/freelancer
*/
exports.freelancerDashboard = async (req, res) => {
  try {
    // 🔒 Role check
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🎨 Fetch freelancer gigs
    const gigs = await Gig.find({ freelancer: req.user._id });

    // 📦 Fetch freelancer orders
    const orders = await Order.find({ freelancer: req.user._id })
      .populate("gig", "title price")
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    // 💰 Calculate earnings (only PAID orders)
    const totalEarnings = orders
      .filter(order => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.price, 0);

    res.status(200).json({
      role: "freelancer",
      totalGigs: gigs.length,
      totalOrders: orders.length,
      totalEarnings,
      gigs,
      orders,
    });

  } catch (error) {
    console.error("Freelancer dashboard error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
