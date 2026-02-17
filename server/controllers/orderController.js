const Order = require("../models/Order");
const Gig = require("../models/Gig");

/**
 * =================================================
 * CREATE ORDER (CLIENT ONLY)
 * =================================================
 */
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can place orders" });
    }

    const { gigId } = req.body;

    if (!gigId) {
      return res.status(400).json({ message: "Gig ID is required" });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const existingOrder = await Order.findOne({
      gig: gig._id,
      client: req.user.id,
      status: { $ne: "completed" },
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "You already have an active order for this gig",
      });
    }

    const order = await Order.create({
      gig: gig._id,
      client: req.user.id,
      freelancer: gig.freelancer,
      price: gig.price,
      paymentStatus: "unpaid",
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * =================================================
 * MARK ORDER AS PAID (CLIENT ONLY)
 * =================================================
 */
exports.markOrderPaid = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can pay" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.paymentStatus = "paid";
    await order.save();

    res.status(200).json({ message: "Payment successful", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * =================================================
 * CANCEL ORDER (CLIENT ONLY)
 * =================================================
 */
exports.cancelOrder = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can cancel" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * =================================================
 * CLIENT: VIEW OWN ORDERS
 * =================================================
 */
exports.getClientOrders = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ client: req.user.id })
      .populate("gig", "title price")
      .populate("freelancer", "name email");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * =================================================
 * FREELANCER: VIEW ASSIGNED ORDERS
 * =================================================
 */
exports.getFreelancerOrders = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ freelancer: req.user.id })
      .populate("gig", "title price")
      .populate("client", "name email");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * =================================================
 * FREELANCER: UPDATE ORDER STATUS
 * =================================================
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "completed" && order.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Cannot complete unpaid order",
      });
    }

    if (order.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * =================================================
 * SEND MESSAGE INSIDE ORDER
 * =================================================
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.client.toString() !== req.user.id &&
      order.freelancer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.messages.push({
      sender: req.user.id,
      message,
    });

    await order.save();

    res.status(200).json(order.messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * =================================================
 * GET SINGLE ORDER
 * =================================================
 */
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("gig")
      .populate("client", "name email")
      .populate("freelancer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.client.toString() !== req.user.id &&
      order.freelancer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
