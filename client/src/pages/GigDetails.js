import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/gigs/${id}`)
      .then(res => setGig(res.data))
      .catch(() => setGig(null));
  }, [id]);

  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        { gigId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully");
      navigate("/dashboard/client");
    } catch (err) {
      alert("Order failed");
    }
  };

  if (!gig) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{gig.title}</h2>
      <p>{gig.description}</p>
      <p><b>Price:</b> ₹{gig.price}</p>
      <p><b>Freelancer:</b> {gig.freelancer?.name}</p>

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default GigDetails;
