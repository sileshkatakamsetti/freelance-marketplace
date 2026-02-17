const express = require("express");
const router = express.Router();

const {
  createOrder,
  getClientOrders,
  getFreelancerOrders,
  updateOrderStatus,
  getSingleOrder,
  cancelOrder,
  markOrderPaid,
  sendMessage,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

/*
=================================================
CREATE ORDER (Client Only)
=================================================
*/
router.post("/", authMiddleware, createOrder);

/*
=================================================
MARK ORDER AS PAID (Client Payment Simulation)
=================================================
*/
router.put("/pay/:id", authMiddleware, markOrderPaid);

/*
=================================================
CLIENT: VIEW OWN ORDERS
=================================================
*/
router.get("/client", authMiddleware, getClientOrders);

/*
=================================================
FREELANCER: VIEW ASSIGNED ORDERS
=================================================
*/
router.get("/freelancer", authMiddleware, getFreelancerOrders);

/*
=================================================
CANCEL ORDER (Client Only)
=================================================
*/
router.put("/cancel/:id", authMiddleware, cancelOrder);

/*
=================================================
SEND MESSAGE INSIDE ORDER
=================================================
*/
router.post("/:id/message", authMiddleware, sendMessage);

/*
=================================================
UPDATE ORDER STATUS (Freelancer)
=================================================
*/
router.put("/:id", authMiddleware, updateOrderStatus);

/*
=================================================
GET SINGLE ORDER (KEEP LAST)
=================================================
*/
router.get("/:id", authMiddleware, getSingleOrder);

module.exports = router;
