import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  return (
    <nav
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <strong>Freelance Marketplace</strong>

      {/* ADMIN NAVBAR */}
      {role === "admin" && (
        <>
          <Link to="/dashboard/admin">Admin Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/gigs">Gigs</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/withdrawals">Withdrawals</Link>
        </>
      )}

      {/* FREELANCER NAVBAR */}
      {role === "freelancer" && (
        <Link to="/dashboard/freelancer">Freelancer Dashboard</Link>
      )}

      {/* CLIENT NAVBAR */}
      {role === "client" && (
        <Link to="/dashboard/client">Client Dashboard</Link>
      )}

      <div style={{ marginLeft: "auto" }}>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
