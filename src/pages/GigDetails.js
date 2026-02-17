import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../components/ReviewSection";

const GigDetails = () => {
  const { id } = useParams();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ NEW

  useEffect(() => {
    if (!id) {
      setError("Invalid Gig ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5000/api/gigs/${id}`, { timeout: 5000 })
      .then((res) => {
        setGig(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("Gig not found");
        } else {
          setError("Failed to load gig");
        }
        setLoading(false);
      });
  }, [id]);

  /* ================= UI STATES ================= */

  if (loading) {
    return <p>Loading gig details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  /* ================= SUCCESS UI ================= */

  return (
    <div style={{ padding: 20 }}>
      <h2>{gig.title}</h2>
      <p>{gig.description}</p>

      <p><strong>Price:</strong> ₹{gig.price}</p>
      <p><strong>Delivery Time:</strong> {gig.deliveryTime} days</p>

      <p>
        <strong>Rating:</strong>{" "}
        {gig.averageRating > 0
          ? "⭐".repeat(Math.round(gig.averageRating))
          : "No ratings yet"}{" "}
        ({gig.numReviews || 0} reviews)
      </p>

      <hr />

      <ReviewSection gigId={gig._id} />
    </div>
  );
};

export default GigDetails;
