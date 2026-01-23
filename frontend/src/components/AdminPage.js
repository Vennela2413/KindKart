import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import UserStats from "./admin/UserStats";
import DonationOverview from "./admin/DonationOverview";
import ImpactReports from "./admin/ImpactReports";
import FraudManagement from "./admin/FraudManagement";
import "./RolePages.css";

function AdminPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  // Redirect if user is not an admin
  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (user && user.role !== "admin") {
    return null;
  }

  return (
    <div className="role-page">
      <h1>🛡️ Admin Control Panel</h1>

      <nav className="sub-nav">
        <Link to="dashboard" className="btn">📊 Dashboard</Link>
        <Link to="donations" className="btn">📦 Donations</Link>
        <Link to="users" className="btn">👥 Users</Link>
        <Link to="reports" className="btn">📈 Impact Reports</Link>
        <Link to="fraud" className="btn">⚠️ Safety & Fraud</Link>
      </nav>

      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserStats />} />
        <Route path="donations" element={<DonationOverview />} />
        <Route path="reports" element={<ImpactReports />} />
        <Route path="fraud" element={<FraudManagement />} />
      </Routes>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [donations, users] = await Promise.all([
        fetch("http://localhost:5000/api/donations").then(r => r.json()),
        fetch("http://localhost:5000/api/users").then(r => r.json())
      ]);

      const totalDonations = donations.length;
      const collectedDonations = donations.filter(d => d.status === "collected").length;
      const pendingDonations = donations.filter(d => d.status === "pending").length;
      const totalMeals = donations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0);
      const activeNGOs = users.filter(u => u.role === "ngo").length;
      const activeDonors = users.filter(u => u.role === "donor").length;
      const abandonedDonations = donations.filter(d => {
        const hoursOld = (new Date() - new Date(d.createdAt)) / (1000 * 60 * 60);
        return d.status === "pending" && hoursOld > 24;
      }).length;

      setStats({
        totalDonations,
        collectedDonations,
        pendingDonations,
        abandonedDonations,
        totalMeals,
        activeNGOs,
        activeDonors,
        collectionRate: totalDonations > 0 ? Math.round((collectedDonations / totalDonations) * 100) : 0
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        <div className="stat-box success">
          <h3>✓ Collected</h3>
          <p className="stat-number">{stats.collectedDonations}</p>
          <small>{stats.collectionRate}% collection rate</small>
        </div>

        <div className="stat-box warning">
          <h3>⏳ Pending</h3>
          <p className="stat-number">{stats.pendingDonations}</p>
          <small>Awaiting NGO pickup</small>
        </div>

        <div className="stat-box danger">
          <h3>⚠️ Abandoned</h3>
          <p className="stat-number">{stats.abandonedDonations}</p>
          <small>24+ hours old</small>
        </div>

        <div className="stat-box info">
          <h3>🍽️ Meals Saved</h3>
          <p className="stat-number">{stats.totalMeals}</p>
          <small>Total portions</small>
        </div>

        <div className="stat-box info">
          <h3>🏥 Active NGOs</h3>
          <p className="stat-number">{stats.activeNGOs}</p>
          <small>Collecting food</small>
        </div>

        <div className="stat-box info">
          <h3>🍽️ Active Donors</h3>
          <p className="stat-number">{stats.activeDonors}</p>
          <small>Sharing surplus</small>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
