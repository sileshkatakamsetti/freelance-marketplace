const Order = require("../models/Order");
const Gig = require("../models/Gig");

/* =====================================
   CREATE ORDER (CLIENT)
===================================== */
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can place orders" });
    }

    const { gigId } = req.body;
    if (!gigId) {
      return res.status(400).json({ message: "Gig ID required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // ✅ IMPORTANT FIX (you already noted this correctly)
    if (!gig.freelancer) {
      return res.status(400).json({
        message: "This gig has no freelancer assigned",
      });
    }

    const existing = await Order.findOne({
      gig: gigId,
      client: req.user.id,
      status: { $ne: "completed" },
    });

    if (existing) {
      return res.status(400).json({ message: "Order already exists" });
    }

    const order = await Order.create({
      gig: gig._id,
      client: req.user.id,
      freelancer: gig.freelancer,
      price: gig.price,
      status: "pending",
      paymentStatus: "unpaid",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================
   CLIENT ORDERS
===================================== */
exports.getClientOrders = async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user.id })
      .populate("gig", "title price")
      .populate("freelancer", "name");

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Client orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================
   FREELANCER ORDERS
===================================== */
exports.getFreelancerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ freelancer: req.user.id })
      .populate("gig", "title price")
      .populate("client", "name");

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Freelancer orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================
   STEP 4 – SUBMIT WORK (FREELANCER)
===================================== */
exports.submitWork = async (req, res) => {
  try {
    const { message, link } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    order.deliveryMessage = message;
    order.deliveryLink = link;
    order.deliveredAt = new Date();
    order.status = "delivered";

    await order.save();

    res.status(200).json({ message: "Work submitted" });
  } catch (err) {
    console.error("Submit work error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================
   STEP 5 – CLIENT ACCEPT WORK
===================================== */
exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Work not delivered yet" });
    }

    order.status = "completed";
    await order.save();

    res.status(200).json({ message: "Order completed" });
  } catch (err) {
    console.error("Complete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================
   STEP 6 – CLIENT REVIEW & RATING
===================================== */
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Order not completed yet" });
    }

    if (order.review && order.review.rating) {
      return res
        .status(400)
        .json({ message: "Review already submitted" });
    }

    order.review = {
      rating,
      comment,
      reviewedAt: new Date(),
    };

    await order.save();

    res.json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =====================================
   SINGLE ORDER
===================================== */
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("gig")
      .populate("client", "name")
      .populate("freelancer", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Single order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
