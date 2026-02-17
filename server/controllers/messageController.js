const Message = require("../models/Message");
const Order = require("../models/Order");

/*
=================================================
SEND MESSAGE (Client or Freelancer)
=================================================
*/
exports.sendMessage = async (req, res) => {
  try {
    const { orderId, content } = req.body;

    if (!orderId || !content) {
      return res.status(400).json({
        message: "Order ID and message content are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only client or freelancer of that order can send message
    if (
      order.client.toString() !== req.user.id &&
      order.freelancer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const message = await Message.create({
      order: orderId,
      sender: req.user.id,
      content,
    });

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/*
=================================================
GET MESSAGES BY ORDER
=================================================
*/
exports.getMessages = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.client.toString() !== req.user.id &&
      order.freelancer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const messages = await Message.find({
      order: req.params.orderId,
    }).populate("sender", "name role");

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
