import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AvailableDonations from "./ngo/AvailableDonations";
import CollectedList from "./ngo/CollectedList";
import "./RolePages.css";

function NGOPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  // Redirect if user is not an NGO
  React.useEffect(() => {
    if (user && user.role !== "ngo") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (user && user.role !== "ngo") {
    return null;
  }

  return (
    <div className="role-page">
      <h1>🏥 NGO Dashboard</h1>

      <nav className="sub-nav">
        <Link to="available" className="btn">🥗 Available Donations</Link>
        <Link to="collected" className="btn">📦 My Collected</Link>
      </nav>

      <Routes>
        <Route path="available" element={<AvailableDonations />} />
        <Route path="collected" element={<CollectedList />} />
      </Routes>
    </div>
  );
}
export default NGOPage;
