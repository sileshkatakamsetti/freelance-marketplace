import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Dashboard</h2>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Clients: {stats.totalClients}</p>
      <p>Total Freelancers: {stats.totalFreelancers}</p>
      <p>Total Gigs: {stats.totalGigs}</p>
      <p>Total Orders: {stats.totalOrders}</p>
      <p>Total Revenue: ₹{stats.totalRevenue}</p>
    </div>
  );
};

export default AdminDashboard;
