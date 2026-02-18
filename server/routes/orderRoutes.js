const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createOrder,
  getClientOrders,
  getFreelancerOrders,
  submitWork,
  completeOrder,
  getSingleOrder,
} = require("../controllers/orderController");

/* CREATE ORDER */
router.post("/", auth, createOrder);

/* CLIENT ORDERS */
router.get("/client", auth, getClientOrders);

/* FREELANCER ORDERS */
router.get("/freelancer", auth, getFreelancerOrders);

/* SUBMIT WORK */
router.put("/:orderId/submit", auth, submitWork);

/* CLIENT ACCEPT WORK */
router.put("/:orderId/complete", auth, completeOrder);

/* SINGLE ORDER */
router.get("/:id", auth, getSingleOrder);

module.exports = router;
