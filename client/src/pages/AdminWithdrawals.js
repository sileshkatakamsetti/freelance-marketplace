import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const token = localStorage.getItem("token");

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/withdrawals",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const approveWithdrawal = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/withdrawals/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Withdrawal approved");
      fetchWithdrawals();
    } catch {
      alert("Approval failed");
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Withdrawal Requests</h2>

      {withdrawals.length === 0 && <p>No withdrawal requests</p>}

      {withdrawals.map((w) => (
        <div
          key={w._id}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}
        >
          <p><b>Freelancer:</b> {w.freelancer?.name}</p>
          <p><b>Amount:</b> ₹{w.amount}</p>
          <p><b>Status:</b> {w.status}</p>

          {w.status === "pending" && (
            <button onClick={() => approveWithdrawal(w._id)}>
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminWithdrawals;
