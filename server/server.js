const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// =======================
// ROUTES
// =======================
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const gigRoutes = require("./routes/gigRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes/messageRoutes");

// =======================
// MODELS
// =======================
const Message = require("./models/Message");

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// 🔗 CONNECT DATABASE
// =======================
connectDB();

// =======================
// 🔥 GLOBAL MIDDLEWARE
// =======================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// =======================
// 🚀 API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);

// =======================
// 🌍 ROOT ROUTE
// =======================
app.get("/", (req, res) => {
  res.status(200).send("🚀 Freelance Marketplace API is running");
});

// =======================
// 🔥 SOCKET.IO SETUP
// =======================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join order room
  socket.on("joinRoom", (orderId) => {
    if (!orderId) return;
    socket.join(orderId);
    console.log(`📌 Joined room: ${orderId}`);
  });

  // ✅ FIXED SEND MESSAGE
  socket.on("sendMessage", async (data) => {
    try {
      const { orderId, sender, message } = data;

      if (!orderId || !sender || !message) return;

      const savedMessage = await Message.create({
        order: orderId,
        sender: sender, // ✅ sender is USER ID
        content: message,
      });

      const populatedMessage = await Message.findById(savedMessage._id)
        .populate("sender", "name email role");

      io.to(orderId).emit("receiveMessage", populatedMessage);
    } catch (error) {
      console.error("❌ Socket error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// =======================
// 🟢 START SERVER
// =======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
