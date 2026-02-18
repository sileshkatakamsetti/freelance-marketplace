import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Admin orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [fetchOrders, token]);

  const releaseFunds = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/orders/${orderId}/release-funds`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Funds released successfully");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Release failed");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading orders...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Gig</th>
            <th>Client</th>
            <th>Freelancer</th>
            <th>Price</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Escrow</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.gig?.title}</td>
              <td>{order.client?.name}</td>
              <td>{order.freelancer?.name}</td>
              <td>₹{order.price}</td>
              <td>{order.status}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.fundsReleased ? "Released" : "Held"}</td>
              <td>
                {order.status === "completed" &&
                  order.paymentStatus === "paid" &&
                  !order.fundsReleased && (
                    <button onClick={() => releaseFunds(order._id)}>
                      Release Funds
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
