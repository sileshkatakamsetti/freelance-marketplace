import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleBlock = async (id) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/admin/users/${id}/block`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin User Management</h2>

      {users.map((u) => (
        <div key={u._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p><b>Name:</b> {u.name}</p>
          <p><b>Email:</b> {u.email}</p>
          <p><b>Role:</b> {u.role}</p>
          <p><b>Status:</b> {u.isBlocked ? "Blocked" : "Active"}</p>

          {u.role !== "admin" && (
            <button onClick={() => toggleBlock(u._id)}>
              {u.isBlocked ? "Unblock" : "Block"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
