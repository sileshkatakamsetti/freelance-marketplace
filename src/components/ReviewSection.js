import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewSection = ({ gigId, orderId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!gigId) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reviews/${gigId}`
        );
        setReviews(res.data);
      } catch (error) {
        console.error("Fetch reviews error:", error.message);
      }
    };

    fetchReviews();
  }, [gigId]); // ✅ ESLint satisfied

  const submitReview = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          gig: gigId,
          order: orderId,
          rating: Number(rating),
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");
      setRating(5);

      // Refresh reviews after submit
      const res = await axios.get(
        `http://localhost:5000/api/reviews/${gigId}`
      );
      setReviews(res.data);

      alert("✅ Review submitted successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message || "❌ Error submitting review"
      );
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>⭐ Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((review) => (
        <div
          key={review._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>{review.user?.name}</strong>
          <p>Rating: {"⭐".repeat(review.rating)}</p>
          <p>{review.comment}</p>
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <h4>Leave a Review</h4>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>

        <br /><br />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          rows="3"
          style={{ width: "100%" }}
        />

        <br /><br />

        <button onClick={submitReview}>Submit Review</button>
      </div>
    </div>
  );
};

export default ReviewSection;
