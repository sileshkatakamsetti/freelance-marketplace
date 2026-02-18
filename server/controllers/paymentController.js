const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// ===============================
// RAZORPAY INSTANCE
// ===============================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// CREATE RAZORPAY ORDER
// ===============================
exports.createRazorpayOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount required" });
    }

    // ✅ ENSURE NUMBER
    amount = Number(amount);

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // rupees → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // ✅ RESPONSE MATCHES FRONTEND
    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Razorpay order failed" });
  }
};

// ===============================
// VERIFY RAZORPAY PAYMENT
// ===============================
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // ✅ STRICT VALIDATION
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ UPDATE ORDER
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "paid";
    order.status = "in-progress";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
