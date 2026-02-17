const { io } = require("socket.io-client");

console.log("🔄 Trying to connect...");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  socket.emit("joinRoom", "test123");

  setTimeout(() => {
    console.log("📤 Sending message...");
    socket.emit("sendMessage", {
  orderId: "64f1a9e4c1b123456789abcd",  // real order id
  sender: "64f1a8e3c1b123456789abce",   // real user id
  receiver: "64f1a8f7c1b123456789abcf", // real user id
  message: "Hello real database message!",
});

  }, 2000);
});

socket.on("receiveMessage", (data) => {
  console.log("📩 Message received:", data);
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection error:", err.message);
});
