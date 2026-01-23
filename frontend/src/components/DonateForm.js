import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DonateForm.css";

const API_URL = "http://localhost:5000/api";

function DonateForm() {
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first to donate");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      const response = await fetch(`${API_URL}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: user.id,
          foodName,
          quantity,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit donation");
        setLoading(false);
        return;
      }

      alert("Donation Submitted Successfully!");
      setFoodName("");
      setQuantity("");
      setLocation("");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Donate Food</h2>
      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Food Name</label>
        <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />

        <label>Quantity</label>
        <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

        <label>Pickup Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Donation"}</button>
      </form>
    </div>
  );
}

export default DonateForm;
