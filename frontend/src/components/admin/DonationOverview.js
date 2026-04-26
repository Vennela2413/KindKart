import React, { useEffect, useState } from "react";
import Toast from "../Toast";
import "../ngo/NGOStyles.css";

const API_URL = "https://kindkart-2.onrender.com/api";

function DonationOverview() {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [flags, setFlags] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filterStatus, donations]);

  const fetchAll = async () => {
    try {
      const res = await fetch(`${API_URL}/donations`);
      const data = await res.json();
      setDonations(data);
      setError("");
    } catch (err) {
      setError("Failed to load donations");
      setToast({ message: "Failed to load donations", type: "error" });
    }
    setLoading(false);
  };

  const applyFilter = () => {
    if (filterStatus === "all") {
      setFilteredDonations(donations);
    } else if (filterStatus === "abandoned") {
      // Donations pending for 24+ hours
      setFilteredDonations(
        donations.filter(d => {
          const hoursOld = (new Date() - new Date(d.createdAt)) / (1000 * 60 * 60);
          return d.status === "pending" && hoursOld > 24;
        })
      );
    } else {
      setFilteredDonations(donations.filter(d => d.status === filterStatus));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/donations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setToast({ message: `✓ Donation marked as ${status}`, type: "success" });
        fetchAll();
      }
    } catch (err) {
      setToast({ message: "Failed to update donation", type: "error" });
    }
  };

  const flagDonation = async (id, reason) => {
    setFlags({ ...flags, [id]: reason });
    setToast({ message: `⚠️ Donation flagged for: ${reason}`, type: "warning" });
  };

  const resolveConflict = async (donorId, ngoId) => {
    setToast({
      message: "📞 Conflict recorded. Will contact parties involved.",
      type: "info"
    });
  };

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <div className="donations-container" style={{ paddingTop: 30 }}>
      <h2>📦 Donation Management</h2>
      <p className="subtitle">Monitor, verify, and manage all donations</p>

      {error && <div className="alert-error">{error}</div>}

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All ({donations.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
          onClick={() => setFilterStatus("pending")}
        >
          ⏳ Pending
        </button>
        <button
          className={`filter-btn ${filterStatus === "accepted" ? "active" : ""}`}
          onClick={() => setFilterStatus("accepted")}
        >
          ✓ Accepted
        </button>
        <button
          className={`filter-btn ${filterStatus === "collected" ? "active" : ""}`}
          onClick={() => setFilterStatus("collected")}
        >
          ✓✓ Collected
        </button>
        <button
          className={`filter-btn ${filterStatus === "abandoned" ? "active" : ""}`}
          onClick={() => setFilterStatus("abandoned")}
        >
          ⚠️ Abandoned (24+h)
        </button>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="no-donations">
          <p>No donations found for this filter</p>
        </div>
      ) : (
        <div className="donations-grid">
          {filteredDonations.map((d) => {
            const hoursOld = (new Date() - new Date(d.createdAt)) / (1000 * 60 * 60);
            const isAbandoned = d.status === "pending" && hoursOld > 24;

            return (
              <div
                key={d._id}
                className="donation-card"
                style={{
                  borderLeft: flags[d._id] ? "6px solid #ff6b6b" : "6px solid #667eea",
                  opacity: isAbandoned ? 0.8 : 1
                }}
              >
                <div className="donation-header">
                  <h3>{d.foodName}</h3>
                  <div>
                    <span className={`status-badge ${d.status === "collected" ? "collected" : d.status === "accepted" ? "accepted" : "pending"}`}>
                      {d.status.toUpperCase()}
                    </span>
                    {isAbandoned && <span style={{ marginLeft: 10, color: "#ff6b6b", fontWeight: "bold" }}>⚠️ OLD</span>}
                    {flags[d._id] && <span style={{ marginLeft: 10, color: "#ff6b6b" }}>🚩 FLAGGED</span>}
                  </div>
                </div>

                <div className="donation-details">
                  <p><strong>👤 Donor:</strong> {d.donorId?.name || "Unknown"}</p>
                  <p><strong>📱 Phone:</strong> {d.donorId?.phone || "Not provided"}</p>
                  <p><strong>🍽️ Quantity:</strong> {d.quantity} portions</p>
                  <p><strong>📍 Location:</strong> {d.location}</p>
                  <p><strong>⏰ Posted:</strong> {new Date(d.createdAt).toLocaleString()}</p>
                  <p><strong>⏱️ Age:</strong> {Math.round(hoursOld)} hours</p>
                  {d.description && <p><strong>📝 Notes:</strong> {d.description}</p>}
                </div>

                <div style={{ padding: "0 20px 20px" }}>
                  {d.status !== "collected" && (
                    <>
                      {d.status === "pending" && (
                        <button
                          className="btn-collect"
                          onClick={() => updateStatus(d._id, "accepted")}
                          style={{ marginBottom: 10 }}
                        >
                          ✓ Mark Accepted
                        </button>
                      )}
                      <button
                        className="btn-collect"
                        onClick={() => updateStatus(d._id, "collected")}
                        style={{ marginBottom: 10 }}
                      >
                        ✓✓ Mark Collected
                      </button>
                    </>
                  )}

                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button
                      style={{
                        padding: "8px 12px",
                        background: "#ffa500",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                      onClick={() => flagDonation(d._id, "suspicious_donor")}
                    >
                      🚩 Flag
                    </button>
                    <button
                      style={{
                        padding: "8px 12px",
                        background: "#ff6b6b",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                      onClick={() => resolveConflict(d.donorId?.id, d.donorId?.id)}
                    >
                      🤝 Resolve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

export default DonationOverview;
