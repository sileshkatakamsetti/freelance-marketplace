import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/admin/gigs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setGigs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteGig = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this gig?")) return;

    await axios.delete(`http://localhost:5000/api/admin/gigs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setGigs((prev) => prev.filter((g) => g._id !== id));
  };

  if (loading) return <p>Loading gigs...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Gig Management</h2>

      {gigs.length === 0 && <p>No gigs found.</p>}

      {gigs.map((gig) => (
        <div key={gig._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p><b>Title:</b> {gig.title}</p>
          <p><b>Price:</b> ₹{gig.price}</p>
          <p><b>Category:</b> {gig.category}</p>
          <p><b>Freelancer:</b> {gig.freelancer?.name}</p>
          <button onClick={() => deleteGig(gig._id)}>Delete Gig</button>
        </div>
      ))}
    </div>
  );
};

export default AdminGigs;
