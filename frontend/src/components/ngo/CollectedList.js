import React, { useEffect, useState } from "react";
import Toast from "../Toast";
import "./NGOStyles.css";

const API_URL = "http://localhost:5000/api";

function CollectedList() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCollected();
    const interval = setInterval(fetchCollected, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCollected = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setDonations([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/donations`);
      const data = await res.json();

      // Show only collected donations belonging to the logged-in NGO
     // Inside fetchCollected in CollectedList.js
const collected = data.filter((d) => {
  if (d.status !== "collected") return false;

  const donationNgoId = d.ngoId?._id || d.ngoId;
  const loggedInNgoId = user._id || user.id;

  // Log these to your console to see if they actually match!
  console.log(`Comparing Donation NGO: ${donationNgoId} with LoggedIn NGO: ${loggedInNgoId}`);

  return donationNgoId && String(donationNgoId) === String(loggedInNgoId);
});

      setDonations(collected);
      setError("");
    } catch (err) {
      setError("Failed to load collected donations");
      setToast({ message: "Failed to load collected donations", type: "error" });
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading your collection history...</div>;

  return (
    <div className="donations-container" style={{ paddingTop: 30 }}>
      <h2>My Collected Donations</h2>
      <p className="subtitle">History of donations you've collected from donors</p>

      {error && <div className="alert-error">{error}</div>}

      {donations.length === 0 ? (
        <div className="no-donations">
          <p>You haven't collected any donations yet. Start collecting donations to make an impact.</p>
        </div>
      ) : (
        <div className="collected-stats">
          <div className="stat-card">
            <h3>{donations.length}</h3>
            <p>Donations Collected</p>
          </div>
          <div className="stat-card">
            <h3>{donations.reduce((sum, d) => sum + parseInt(d.quantity || 0), 0)}</h3>
            <p>Total Portions</p>
          </div>
        </div>
      )}

      <div className="donations-grid">
        {donations.map((donation) => (
          <div key={donation._id} className="donation-card">
            <div className="donation-header">
              <h3>{donation.foodName}</h3>
              <span className="status-badge collected">✓ Collected</span>
            </div>

            <div className="donation-details">
              <p><strong>📦 Quantity:</strong> {donation.quantity} portions</p>
              <p><strong>📍 Location:</strong> {donation.location}</p>
              <p><strong>👤 Donor:</strong> {donation.donorId?.name || "Unknown"}</p>
              <p><strong>📱 Phone:</strong> {donation.donorId?.phone || "Not provided"}</p>
              <p><strong>⏰ Posted:</strong> {new Date(donation.createdAt).toLocaleString()}</p>
              {donation.description && (
                <p><strong>📝 Notes:</strong> {donation.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

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

export default CollectedList;
