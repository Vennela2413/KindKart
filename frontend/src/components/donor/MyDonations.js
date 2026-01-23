import React, { useEffect, useState, useRef } from "react";
import Toast from "../Toast";
import "../ngo/NGOStyles.css";

const API_URL = "http://localhost:5000/api";

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const prevStatuses = useRef({});

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDonations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setDonations([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/donations`);
      const data = await res.json();

      const my = data.filter((d) => String(d.donorId?._id || d.donorId) === String(user.id));

      // compare statuses to notify donor of changes
      my.forEach((d) => {
        const prev = prevStatuses.current[d._id];
        if (prev && prev !== d.status && d.status === "collected") {
          setToast({ message: `✓ Your donation "${d.foodName}" has been collected!`, type: "success" });
        }
        prevStatuses.current[d._id] = d.status;
      });

      setDonations(my);
      setError("");
    } catch (err) {
      setError("Failed to load your donations");
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading your donations...</div>;

  return (
    <div className="donations-container" style={{ paddingTop: 30 }}>
      <h2>📋 My Donations</h2>
      <p className="subtitle">Your posted donations and their current status</p>

      {error && <div className="alert-error">{error}</div>}

      {donations.length === 0 ? (
        <div className="no-donations">
          <p>You have not posted any donations yet.</p>
        </div>
      ) : (
        <div className="donations-grid">
          {donations.map((donation) => (
            <div key={donation._id} className="donation-card">
              <div className="donation-header">
                <h3>{donation.foodName}</h3>
                <span className={`status-badge ${donation.status === 'collected' ? 'collected' : 'pending'}`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </span>
              </div>

              <div className="donation-details">
                <p><strong>📦 Quantity:</strong> {donation.quantity} portions</p>
                <p><strong>📍 Location:</strong> {donation.location}</p>
                <p><strong>⏰ Posted:</strong> {new Date(donation.createdAt).toLocaleString()}</p>
              </div>
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

export default MyDonations;
