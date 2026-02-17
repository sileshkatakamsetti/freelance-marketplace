import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div
      style={{
        padding: "15px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3>Freelance Marketplace</h3>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {role === "client" && (
          <a href="/dashboard/client">Client Dashboard</a>
        )}

        {role === "freelancer" && (
          <a href="/dashboard/freelancer">Freelancer Dashboard</a>
        )}

        {role === "admin" && (
          <>
            <a href="/dashboard/admin">Admin Dashboard</a>
            <a href="/dashboard/admin/manage">Users</a>
            <a href="/dashboard/admin/gigs">Gigs</a>
            <a href="/dashboard/admin/orders">Orders</a>
          </>
        )}

        {role && (
          <button onClick={logoutHandler}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
