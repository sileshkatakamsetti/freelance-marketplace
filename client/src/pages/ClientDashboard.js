import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const ClientDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [gigs, setGigs] = useState([]);

  const [rating, setRating] = useState({});
  const [comment, setComment] = useState({});

  const token = localStorage.getItem("token");

  // =========================
  // FETCH CLIENT ORDERS
  // =========================
  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/client",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // =========================
  // FETCH AVAILABLE GIGS
  // =========================
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/gigs")
      .then((res) => setGigs(res.data || []))
      .catch(() => setGigs([]));
  }, []);

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder = async (gigId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        { gigId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  // =========================
  // PAY NOW
  // =========================
  const payNow = async (order) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: order.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId, amount, currency, key } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: "Freelance Marketplace",
        description: "Order Payment",
        order_id: razorpayOrderId,

        handler: async function (response) {
          await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("Payment successful");
          fetchOrders();
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment failed");
    }
  };

  // =========================
  // ACCEPT WORK
  // =========================
  const acceptWork = async (orderId) => {
    await axios.put(
      `http://localhost:5000/api/orders/${orderId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Order completed");
    fetchOrders();
  };

  // =========================
  // SUBMIT REVIEW
  // =========================
  const submitReview = async (orderId) => {
    if (!rating[orderId] || !comment[orderId]) {
      alert("Rating & comment required");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/reviews",
      {
        orderId,
        rating: rating[orderId],
        comment: comment[orderId],
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Review submitted ⭐");

    setRating((prev) => ({ ...prev, [orderId]: "" }));
    setComment((prev) => ({ ...prev, [orderId]: "" }));

    fetchOrders();
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div style={{ padding: "30px" }}>
      <h2>Client Dashboard</h2>

      {/* ================= AVAILABLE GIGS ================= */}
      <h3>Available Gigs</h3>

      {gigs.map((gig) => (
        <div
          key={gig._id}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}
        >
          <p><b>{gig.title}</b></p>
          <p>₹{gig.price}</p>
          <button onClick={() => placeOrder(gig._id)}>
            Place Order
          </button>
        </div>
      ))}

      <hr />

      {/* ================= YOUR ORDERS ================= */}
      <h3>Your Orders</h3>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{ border: "1px solid #aaa", padding: 15, marginBottom: 15 }}
        >
          <p><b>Gig:</b> {order.gig?.title}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Payment:</b> {order.paymentStatus}</p>

          {order.paymentStatus === "unpaid" && (
            <button onClick={() => payNow(order)}>Pay Now</button>
          )}

          {order.status === "delivered" && (
            <>
              <p><b>Message:</b> {order.deliveryMessage}</p>

              <a
                href={
                  order.deliveryLink.startsWith("http")
                    ? order.deliveryLink
                    : `https://${order.deliveryLink}`
                }
                target="_blank"
                rel="noreferrer"
              >
                Delivery Link
              </a>

              <br />
              <button onClick={() => acceptWork(order._id)}>
                Accept Work
              </button>
            </>
          )}

          {order.status === "completed" && (
            <>
              <h4>Leave Review</h4>

              <select
                value={rating[order._id] || ""}
                onChange={(e) =>
                  setRating({ ...rating, [order._id]: e.target.value })
                }
              >
                <option value="">Rating</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="2">⭐⭐</option>
                <option value="1">⭐</option>
              </select>

              <textarea
                value={comment[order._id] || ""}
                onChange={(e) =>
                  setComment({ ...comment, [order._id]: e.target.value })
                }
                placeholder="Write review"
                rows="3"
                style={{ width: "100%", marginTop: 5 }}
              />

              <button onClick={() => submitReview(order._id)}>
                Submit Review
              </button>
            </>
          )}

          <a
            href={`/chat/${order._id}`}
            style={{ display: "block", marginTop: "10px" }}
          >
            💬 Open Chat
          </a>
        </div>
      ))}
    </div>
  );
};

export default ClientDashboard;
