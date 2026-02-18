import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:5000";

const ChatPage = () => {
  const { orderId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null); // ✅ FIX

  // ================= LOAD OLD MESSAGES =================
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/messages/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIX
      })
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]));
  }, [orderId, token]);

  // ================= SOCKET =================
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit("joinRoom", orderId);

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, [orderId]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!text.trim()) return;
    if (!socketRef.current) return; // ✅ FIX

    socketRef.current.emit("sendMessage", {
      orderId,
      sender: user._id,
      content: text,
    });

    setText("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender?.name || "User"}:</b>{" "}
            {m.content || m.message}
          </p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        style={{ width: "80%" }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
