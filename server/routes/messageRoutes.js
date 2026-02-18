const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Message = require("../models/Message");

router.get("/:orderId", auth, async (req, res) => {
  const messages = await Message.find({ order: req.params.orderId })
    .populate("sender", "name")
    .sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;
