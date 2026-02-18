const Order = require("../models/Order");
const User = require("../models/User");
const Gig = require("../models/Gig");

/*
=========================================
ADMIN DASHBOARD
=========================================
*/
exports.getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: "client" });
    const totalFreelancers = await User.countDocuments({ role: "freelancer" });
    const totalGigs = await Gig.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "completed",
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const platformCommission = Number((totalRevenue * 0.1).toFixed(2));

    res.status(200).json({
      role: "admin",
      totalUsers,
      totalClients,
      totalFreelancers,
      totalGigs,
      totalOrders,
      totalRevenue,
      platformCommission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
GET ALL USERS (ADMIN)
=========================================
*/
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
BLOCK / UNBLOCK USER
=========================================
*/
exports.toggleBlockUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
GET ALL GIGS (ADMIN)
=========================================
*/
exports.getAllGigsAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const gigs = await Gig.find().populate(
      "freelancer",
      "name email"
    );

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
DELETE GIG (ADMIN)
=========================================
*/
exports.deleteGigAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Gig.findByIdAndDelete(req.params.gigId);

    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
GET ALL ORDERS (ADMIN)
=========================================
*/
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find()
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .populate("gig", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
🟡 DAY 27 — RELEASE ESCROW FUNDS (ADMIN)
=========================================
*/
exports.releaseOrderFunds = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validation checks (NO existing logic affected)
    if (order.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Order is not completed yet" });
    }

    if (order.paymentStatus !== "paid") {
      return res
        .status(400)
        .json({ message: "Payment not completed" });
    }

    if (order.fundsReleased) {
      return res
        .status(400)
        .json({ message: "Funds already released" });
    }

    // Update order escrow fields
    order.fundsReleased = true;
    order.releasedAt = new Date();
    await order.save();

    // Update freelancer earnings
    const freelancer = await User.findById(order.freelancer);
    if (freelancer) {
      freelancer.earnings += order.price;
      await freelancer.save();
    }

    res.status(200).json({
      message: "Funds released to freelancer successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
