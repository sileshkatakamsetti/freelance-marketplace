import React, { useEffect, useState } from "react";
import API from "../utils/api";

const ClientDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/dashboard/client")
      .then((res) => {
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Client dashboard error:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading Client Dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Client Dashboard</h2>

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
          <p><strong>Freelancer:</strong> {order.freelancer?.name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment:</strong> {order.paymentStatus}</p>

          <a href={`/chat/${order._id}`}>Open Chat</a>
        </div>
      ))}
    </div>
  );
};

export default ClientDashboard;
