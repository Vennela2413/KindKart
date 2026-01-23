import React, { useState, useEffect } from "react";
import Toast from "../Toast";
import "./NGOStyles.css";

const API_URL = "http://localhost:5000/api";

function AvailableDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch(`${API_URL}/donations`);
      const data = await response.json();
      setDonations(data.filter(d => d.status === "pending"));
      setError("");
    } catch (err) {
      setError("Failed to load donations");
    }
    setLoading(false);
  };
const collectDonation = async (donationId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);
    // FIX: Try both _id and id to be safe
    const currentNgoId = user?._id || user?.id;
    console.log("currentNgoId:", currentNgoId);

    const body = {
      status: "collected",
      ngoId: currentNgoId // Ensure this is not undefined
    };
    console.log("Sending body:", body);

    const response = await fetch(`${API_URL}/donations/${donationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

      if (response.ok) {
        setToast({ message: "✓ Donation collected successfully!", type: "success" });
        fetchDonations();
      } else {
        console.log("Response not ok:", response.status, response.statusText);
        setToast({ message: "Failed to collect donation", type: "error" });
      }
    } catch (err) {
      console.log("Error in collectDonation:", err);
      setToast({ message: "Failed to collect donation", type: "error" });
    }
  };

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <div className="donations-container">
      <h2>🥗 Available Donations</h2>
      <p className="subtitle">Browse and collect food donations nearby</p>

      {error && <div className="alert-error">{error}</div>}

      {donations.length === 0 ? (
        <div className="no-donations">
          <p>No donations available at the moment. Check back soon! 🕐</p>
        </div>
      ) : (
        <div className="donations-grid">
          {donations.map((donation) => (
            <div key={donation._id} className="donation-card">
              <div className="donation-header">
                <h3>{donation.foodName}</h3>
                <span className="status-badge pending">Available</span>
              </div>
              <div className="donation-details">
                <p><strong>📦 Quantity:</strong> {donation.quantity} portions</p>
                <p><strong>📍 Location:</strong> {donation.location}</p>
                <p><strong>⏰ Posted:</strong> {new Date(donation.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                className="btn-collect"
                onClick={() => collectDonation(donation._id)}
              >
                Collect Now
              </button>
            </div>
          ))}
        </div>
      )}

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

export default AvailableDonations;
