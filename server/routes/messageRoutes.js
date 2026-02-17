const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

/*
=================================================
SEND MESSAGE
=================================================
*/
router.post("/", authMiddleware, sendMessage);

/*
=================================================
GET MESSAGES FOR AN ORDER
=================================================
*/
router.get("/:orderId", authMiddleware, getMessages);

module.exports = router;
