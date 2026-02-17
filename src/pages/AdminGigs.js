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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGigs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch gigs error:", err);
        setLoading(false);
      });
  }, []);

  const deleteGig = async (gigId) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this gig?"
    );
    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:5000/api/admin/gigs/${gigId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setGigs((prev) => prev.filter((gig) => gig._id !== gigId));
  };

  if (loading) return <p>Loading gigs...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Gig Management</h2>

      {gigs.length === 0 && <p>No gigs found.</p>}

      {gigs.map((gig) => (
        <div
          key={gig._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><strong>Title:</strong> {gig.title}</p>
          <p><strong>Price:</strong> ₹{gig.price}</p>
          <p><strong>Category:</strong> {gig.category}</p>
          <p>
            <strong>Freelancer:</strong>{" "}
            {gig.freelancer?.name} ({gig.freelancer?.email})
          </p>

          <button onClick={() => deleteGig(gig._id)}>
            Delete Gig
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminGigs;
