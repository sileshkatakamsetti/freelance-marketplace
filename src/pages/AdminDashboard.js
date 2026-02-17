import React, { useEffect, useState } from "react";
import API from "../utils/api";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/api/admin/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Admin dashboard error:", err);
      });
  }, []);

  if (!data) return <p>Loading Admin Dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <p>Total Users: {data.totalUsers}</p>
      <p>Total Clients: {data.totalClients}</p>
      <p>Total Freelancers: {data.totalFreelancers}</p>
      <p>Total Gigs: {data.totalGigs}</p>
      <p>Total Orders: {data.totalOrders}</p>
      <p>Total Revenue: ₹{data.totalRevenue}</p>
      <p>Platform Commission: ₹{data.platformCommission}</p>

      <hr />

      <a href="/dashboard/admin/manage">👉 Manage Users</a>
      <br />
      <a href="/dashboard/admin/gigs">👉 Manage Gigs</a>
    </div>
  );
};

export default AdminDashboard;
