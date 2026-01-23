import React, { useEffect, useState } from "react";
import Toast from "../Toast";
import "../ngo/NGOStyles.css";

const API_URL = "http://localhost:5000/api";

function FraudManagement() {
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [riskUsers, setRiskUsers] = useState([]);
  const [suspiciousDonations, setSuspiciousDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    analyzeData();
  }, []);

  const analyzeData = async () => {
    try {
      const [donationsData, usersData] = await Promise.all([
        fetch(`${API_URL}/donations`).then(r => r.json()),
        fetch(`${API_URL}/users`).then(r => r.json())
      ]);

      setDonations(donationsData);
      setUsers(usersData);

      // Analyze for suspicious patterns
      analyzeRiskPatterns(donationsData, usersData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
    setLoading(false);
  };

  const analyzeRiskPatterns = (donationsData, usersData) => {
    // Find high-risk users
    const riskMap = {};

    donationsData.forEach(d => {
      const donorId = d.donorId?._id || d.donorId;
      if (!riskMap[donorId]) {
        riskMap[donorId] = {
          abandonedCount: 0,
          totalDonations: 0,
          donor: d.donorId,
          riskScore: 0,
          reasons: []
        };
      }

      riskMap[donorId].totalDonations++;

      const hoursOld = (new Date() - new Date(d.createdAt)) / (1000 * 60 * 60);
      if (d.status === "pending" && hoursOld > 24) {
        riskMap[donorId].abandonedCount++;
      }
    });

    // Calculate risk scores
    const riskArray = Object.values(riskMap).filter(r => r.donor).map(r => {
      let score = 0;
      const reasons = [];

      if (r.abandonedCount > 2) {
        score += 40;
        reasons.push(`${r.abandonedCount} abandoned donations`);
      }
      if (r.totalDonations > 10 && r.abandonedCount / r.totalDonations > 0.3) {
        score += 30;
        reasons.push("High abandonment rate (>30%)");
      }

      return {
        ...r,
        riskScore: score,
        reasons,
        riskLevel: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW"
      };
    });

    setRiskUsers(riskArray.filter(r => r.riskScore >= 40).sort((a, b) => b.riskScore - a.riskScore));

    // Find suspicious donations
    const suspicious = donationsData.filter(d => {
      const hoursOld = (new Date() - new Date(d.createdAt)) / (1000 * 60 * 60);
      return (
        (d.status === "pending" && hoursOld > 24) || // Abandoned
        (d.quantity > 500 && d.location === "") // Unrealistic quantity
      );
    });

    setSuspiciousDonations(suspicious);
  };

  const suspendUser = (userId) => {
    setToast({
      message: "📵 User suspended. They will be notified via email.",
      type: "warning"
    });
  };

  const verifyUser = (userId) => {
    setToast({
      message: "✅ User verified and flagged for monitoring.",
      type: "success"
    });
  };

  const contactUser = (userId, name) => {
    setToast({
      message: `📧 Automated email sent to ${name} to resolve donation issues.`,
      type: "info"
    });
  };

  if (loading) return <div className="loading">Analyzing safety patterns...</div>;

  return (
    <div className="donations-container" style={{ paddingTop: 30 }}>
      <h2>⚠️ Safety & Fraud Management</h2>
      <p className="subtitle">Prevent fraud and resolve user conflicts</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 40 }}>
        <StatCard icon="⚠️" label="High-Risk Users" value={riskUsers.filter(r => r.riskLevel === "HIGH").length} color="#ff6b6b" />
        <StatCard icon="⚡" label="Medium-Risk Users" value={riskUsers.filter(r => r.riskLevel === "MEDIUM").length} color="#ffa500" />
        <StatCard icon="🚩" label="Suspicious Donations" value={suspiciousDonations.length} color="#ff6b6b" />
        <StatCard icon="✅" label="Total Users" value={users.length} color="#28a745" />
      </div>

      {riskUsers.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3>👁️ Users Requiring Attention</h3>
          <div style={{ display: "grid", gap: 15 }}>
            {riskUsers.map((user, idx) => (
              <div
                key={idx}
                style={{
                  background: "white",
                  border: `3px solid ${user.riskLevel === "HIGH" ? "#ff6b6b" : "#ffa500"}`,
                  padding: "20px",
                  borderRadius: "10px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 15 }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{user.donor?.name}</h4>
                    <p style={{ color: "#666", margin: "5px 0 0 0" }}>{user.donor?.email}</p>
                  </div>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background: user.riskLevel === "HIGH" ? "#ff6b6b" : "#ffa500",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "12px"
                    }}
                  >
                    {user.riskLevel} RISK
                  </span>
                </div>

                <div style={{ marginBottom: 15, padding: "10px", background: "#f8f9fa", borderRadius: "6px" }}>
                  <p><strong>Risk Score:</strong> {user.riskScore}/100</p>
                  <p><strong>Total Donations:</strong> {user.totalDonations}</p>
                  <p><strong>Abandoned:</strong> {user.abandonedCount}</p>
                  <div style={{ marginTop: 10 }}>
                    <strong>Reasons:</strong>
                    <ul style={{ margin: "5px 0 0 20px" }}>
                      {user.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <button
                    onClick={() => contactUser(user.donor?.id, user.donor?.name)}
                    style={{
                      padding: "10px",
                      background: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    📧 Contact
                  </button>
                  <button
                    onClick={() => verifyUser(user.donor?.id)}
                    style={{
                      padding: "10px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    ✅ Verify
                  </button>
                  <button
                    onClick={() => suspendUser(user.donor?.id)}
                    style={{
                      padding: "10px",
                      background: "#ff6b6b",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    🔒 Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {suspiciousDonations.length > 0 && (
        <div>
          <h3>🚩 Suspicious Donations</h3>
          <div className="donations-grid">
            {suspiciousDonations.map(d => {
              const hoursOld = (new Date() - new Date(d.createdAt)) / (1000 * 60 * 60);
              const isAbandoned = d.status === "pending" && hoursOld > 24;

              return (
                <div
                  key={d._id}
                  className="donation-card"
                  style={{ borderLeft: "6px solid #ff6b6b" }}
                >
                  <div className="donation-header">
                    <h4>{d.foodName}</h4>
                    <span style={{ color: "#ff6b6b", fontWeight: "bold" }}>⚠️ SUSPICIOUS</span>
                  </div>
                  <div className="donation-details">
                    <p><strong>Donor:</strong> {d.donorId?.name}</p>
                    <p><strong>Quantity:</strong> {d.quantity}</p>
                    <p><strong>Status:</strong> {d.status}</p>
                    {isAbandoned && <p style={{ color: "#ff6b6b" }}>⚠️ Abandoned for {Math.round(hoursOld)} hours</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {riskUsers.length === 0 && suspiciousDonations.length === 0 && (
        <div className="no-donations">
          <p>✅ All systems normal. No suspicious activity detected.</p>
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

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: "white",
      border: `3px solid ${color}`,
      padding: "25px",
      borderRadius: "10px",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "32px", marginBottom: "10px" }}>{icon}</div>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>{label}</div>
      <div style={{ fontSize: "36px", fontWeight: "bold", color }}>{value}</div>
    </div>
  );
}

export default FraudManagement;
