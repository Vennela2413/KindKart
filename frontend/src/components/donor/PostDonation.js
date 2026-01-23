import React, { useState } from "react";
import Toast from "../Toast";
import "./DonationStyles.css";

const API_URL = "http://localhost:5000/api";

function PostDonation() {
  const [formData, setFormData] = useState({
    foodName: "",
    foodType: "food",
    quantity: "",
    location: "",
    expiryTime: "",
    phone: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.foodName || !formData.quantity || !formData.location || !formData.phone) {
      setToast({ message: "Please fill all required fields", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`${API_URL}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: user.id,
          foodName: formData.foodName,
          foodType: formData.foodType,
          quantity: formData.quantity,
          location: formData.location,
          expiryTime: formData.expiryTime,
          phone: formData.phone,
          description: formData.description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({ message: data.message || "Failed to post donation", type: "error" });
      } else {
        setToast({ message: "✓ Donation posted successfully! NGOs will see it shortly.", type: "success" });
        setFormData({
          foodName: "",
          foodType: "vegetables",
          quantity: "",
          location: "",
          expiryTime: "",
          phone: "",
          description: ""
        });
      }
    } catch (err) {
      setToast({ message: "Failed to post donation", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="donation-form-container">
      <h2>🍱 Post Your Donation</h2>
      <p className="subtitle">Share your surplus food with NGOs and those in need</p>

      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name/Type *</label>
            <input
              type="text"
              name="foodName"
              placeholder="e.g.,Rice,Sweaters,Toys,books"
              value={formData.foodName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="foodType" value={formData.foodType} onChange={handleChange}>
              <option value="food">🍽️ Food & Meals</option>
              <option value="vegetables">🥗 Vegetables & Fruits</option>
              <option value="cooked">🍚 Cooked Food</option>
              <option value="bakery">🥖 Bakery & Bread</option>
              <option value="dairy">🥛 Dairy Products</option>
              <option value="packaged">📦 Packaged Items</option>
              <option value="clothes">👕 Clothes & Textiles</option>
              <option value="shoes">👟 Shoes & Footwear</option>
              <option value="toys">🧸 Toys & Books</option>
              <option value="other">🔧 Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              placeholder="Number of items"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Phone *</label>
            <input
              type="tel"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pickup Location *</label>
          <input
            type="text"
            name="location"
            placeholder="Event Venue Address, Restaurant Name, etc."
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Available Until</label>
          <input
            type="datetime-local"
            name="expiryTime"
            value={formData.expiryTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Additional Details</label>
          <textarea
            name="description"
            placeholder="Any special instructions, dietary info, storage needs..."
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Posting..." : "📤 Post Donation"}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default PostDonation;
