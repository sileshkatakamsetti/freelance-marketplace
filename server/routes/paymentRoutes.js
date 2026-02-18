const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

router.post("/create-order", auth, createRazorpayOrder);
router.post("/verify", auth, verifyRazorpayPayment);

module.exports = router;
