const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "client",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // 🟡 DAY 27 / 28 – Freelancer Earnings (NO logic change)
    earnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Match password (UNCHANGED)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
