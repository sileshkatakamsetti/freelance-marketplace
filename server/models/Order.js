const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "in-progress", "delivered", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    deliveryMessage: String,
    deliveryLink: String,
    deliveredAt: Date,

    razorpayPaymentId: String,

    // 🟡 DAY 27 – Escrow fields (NO logic change)
    fundsReleased: {
      type: Boolean,
      default: false,
    },
    releasedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
