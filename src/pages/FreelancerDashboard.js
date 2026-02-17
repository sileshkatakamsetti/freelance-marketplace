import React, { useEffect, useState } from "react";
import API from "../utils/api";

const FreelancerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/dashboard/freelancer")
      .then((res) => {
        setOrders(res.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Freelancer dashboard error:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading Freelancer Dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Freelancer Dashboard</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p><strong>Gig:</strong> {order.gig?.title}</p>
          <p><strong>Client:</strong> {order.client?.name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment:</strong> {order.paymentStatus}</p>

          {/* ✅ CHAT LINK */}
          <a href={`/chat/${order._id}`}>Open Chat</a>
        </div>
      ))}
    </div>
  );
};

export default FreelancerDashboard;
