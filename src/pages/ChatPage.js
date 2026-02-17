import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import API from "../utils/api";

const SOCKET_URL = "https://freelance-backend-uvp9.onrender.com";

const ChatPage = () => {
  const { orderId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 LOAD OLD MESSAGES
  useEffect(() => {
    API.get(`/api/messages/${orderId}`)
      .then((res) => {
        setMessages(res.data || []);
      })
      .catch(() => {
        setMessages([]);
      });
  }, [orderId]);

  // 🔹 SOCKET
  useEffect(() => {
    const s = io(SOCKET_URL);

    s.emit("joinRoom", orderId);

    s.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(s);

    return () => s.disconnect();
  }, [orderId]);

  // 🔹 SEND MESSAGE
  const sendMessage = () => {
    if (!text.trim() || !socket) return;

    socket.emit("sendMessage", {
      orderId,
      sender: user._id,
      message: text,
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
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.sender?.name || "User"}:</strong> {m.content}
          </p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
