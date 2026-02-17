import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Admin users fetch error:", err);
        setLoading(false);
      });
  }, []);

  const toggleBlockUser = async (userId) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/admin/users/${userId}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, isBlocked: !user.isBlocked }
          : user
      )
    );
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin User Management</h2>

      {users.map((user) => (
        <div
          key={user._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p>
            <strong>Status:</strong>{" "}
            {user.isBlocked ? "Blocked" : "Active"}
          </p>

          {user.role !== "admin" && (
            <button onClick={() => toggleBlockUser(user._id)}>
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminManagement;
