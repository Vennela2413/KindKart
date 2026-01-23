import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  // If no user logged in, show all options
  // If donor logged in, show only donor
  // If NGO logged in, show only NGO
  // If admin logged in, show only admin

  return (
    <div className="dashboard">
      <h1>Welcome to KindKart</h1>

      <div className="roles">
        {(!user || user.role === "donor") && (
          <div className="role-card donor-card" onClick={() => navigate("/donor")}>
            <h2>Donors</h2>
            <p>Share food, clothes, and toys. Help communities in need.</p>
          </div>
        )}

        {(!user || user.role === "ngo") && (
          <div className="role-card ngo-card" onClick={() => navigate("/ngo")}>
            <h2>Partners</h2>
            <p>Collect donations and distribute to communities.</p>
          </div>
        )}

        {(!user || user.role === "admin") && (
          <div className="role-card admin-card" onClick={() => navigate("/admin")}>
            <h2>Admin</h2>
            <p>Manage platform, track impact, ensure quality.</p>
          </div>
        )}
      </div>

      {user && (
        <div style={{
          marginTop: 40,
          padding: 20,
          background: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
          borderRadius: 10,
          textAlign: "center",
          border: "2px solid #EC4899"
        }}>
          <p><strong>Logged in as:</strong> {user.name} <span style={{background: "#ffb347", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px"}}>{user.role.toUpperCase()}</span></p>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>Showing options for your role</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
