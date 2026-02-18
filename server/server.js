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
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");


// =======================
// MODELS
// =======================
const Message = require("./models/Message");

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// CONNECT DATABASE
// =======================
connectDB();

// =======================
// GLOBAL MIDDLEWARE
// =======================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/withdrawals", withdrawalRoutes);



// =======================
// ROOT ROUTE
// =======================
app.get("/", (req, res) => {
  res.status(200).send("🚀 Freelance Marketplace API is running");
});

// =======================
// SOCKET.IO SETUP (✅ FIXED)
// =======================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // JOIN ROOM (ORDER ID)
  socket.on("joinRoom", (orderId) => {
    if (!orderId) return;
    socket.join(orderId);
    console.log(`📌 Joined room: ${orderId}`);
  });

  // SEND MESSAGE (🔥 MAIN FIX HERE)
  socket.on("sendMessage", async (data) => {
    try {
      const { orderId, sender, content } = data; // ✅ sender (NOT senderId)

      if (!orderId || !sender || !content) return;

      // SAVE MESSAGE
      const savedMessage = await Message.create({
        order: orderId,
        sender: sender,
        content: content,
      });

      // POPULATE SENDER NAME
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate("sender", "name role");

      // SEND TO BOTH USERS IN ROOM
      io.to(orderId).emit("receiveMessage", populatedMessage);
    } catch (error) {
      console.error("❌ Socket message error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
