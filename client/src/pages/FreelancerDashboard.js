import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const FreelancerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);

  // Earnings + Withdrawal
  const [earnings, setEarnings] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Withdrawal History
  const [withdrawals, setWithdrawals] = useState([]);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH FREELANCER ORDERS
  // =========================
  const fetchOrders = useCallback(async () => {
    if (!token) return;

    const res = await axios.get(
      "http://localhost:5000/api/orders/freelancer",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrders(res.data.orders || []);
  }, [token]);

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/reviews/freelancer",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews(res.data.reviews || []);
    } catch {
      setReviews([]);
    }
  }, [token]);

  // =========================
  // FETCH EARNINGS
  // =========================
  const fetchEarnings = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/freelancer/earnings",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEarnings(res.data.totalEarnings || 0);
    } catch {
      setEarnings(0);
    }
  }, [token]);

  // =========================
  // FETCH WITHDRAWALS
  // =========================
  const fetchWithdrawals = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/withdrawals/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWithdrawals(res.data.withdrawals || []);
    } catch {
      setWithdrawals([]);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    fetchReviews();
    fetchEarnings();
    fetchWithdrawals();
  }, [fetchOrders, fetchReviews, fetchEarnings, fetchWithdrawals]);

  // =========================
  // SUBMIT WORK
  // =========================
  const submitWork = async (orderId) => {
    if (!message || !link) {
      alert("Please enter message and delivery link");
      return;
    }

    await axios.put(
      `http://localhost:5000/api/orders/${orderId}/submit`,
      { message, link },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Work submitted successfully ✅");

    setMessage("");
    setLink("");
    setActiveOrder(null);

    fetchOrders();
    fetchReviews();
    fetchEarnings();
    fetchWithdrawals();
  };

  // =========================
  // WITHDRAW
  // =========================
  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/withdrawals/request",
        { amount: Number(withdrawAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Withdrawal request submitted ✅");
      setWithdrawAmount("");
      fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal failed");
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div style={{ padding: "30px" }}>
      <h2>Freelancer Dashboard</h2>

      {/* ================= EARNINGS ================= */}
      <div
        style={{
          border: "1px solid #4caf50",
          padding: 15,
          marginBottom: 20,
          background: "#f1fff3",
        }}
      >
        <h3>💰 Earnings</h3>
        <p><strong>Total Earnings:</strong> ₹{earnings}</p>

        <input
          type="number"
          placeholder="Enter amount to withdraw"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>

      {/* ================= ORDERS ================= */}
      <h3>Orders</h3>

      {orders.length === 0 && <p>No orders assigned yet.</p>}

      {orders.map((o) => (
        <div
          key={o._id}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}
        >
          <p><b>{o.gig?.title}</b></p>
          <p>Status: {o.status}</p>
          <p>Payment: {o.paymentStatus}</p>

          {o.paymentStatus === "paid" && o.status === "in-progress" && (
            <>
              <button onClick={() => setActiveOrder(o._id)}>
                Submit Work
              </button>

              {activeOrder === o._id && (
                <div style={{ marginTop: 10 }}>
                  <textarea
                    placeholder="Work description"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    style={{ width: "100%", marginBottom: 8 }}
                  />

                  <input
                    placeholder="Delivery link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    style={{ width: "100%", marginBottom: 8 }}
                  />

                  <button onClick={() => submitWork(o._id)}>
                    Final Submit
                  </button>
                </div>
              )}
            </>
          )}

          <a
            href={`/chat/${o._id}`}
            style={{ display: "block", marginTop: "10px" }}
          >
            💬 Open Chat
          </a>
        </div>
      ))}

      <hr />

      {/* ================= WITHDRAWAL HISTORY ================= */}
      <h3>Withdrawal History</h3>

      {withdrawals.length === 0 && <p>No withdrawals yet.</p>}

      {withdrawals.map((w) => (
        <div
          key={w._id}
          style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}
        >
          <p><b>Amount:</b> ₹{w.amount}</p>
          <p><b>Status:</b> {w.status}</p>
        </div>
      ))}

      <hr />

      {/* ================= REVIEWS ================= */}
      <h3>Client Reviews ⭐</h3>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r) => (
        <div
          key={r._id}
          style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}
        >
          <p><b>{r.client?.name}</b></p>
          <p>⭐ {r.rating}</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default FreelancerDashboard;
