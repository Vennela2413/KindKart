import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PostDonation from "./donor/PostDonation";
import MyDonations from "./donor/MyDonations";
import "./RolePages.css";

function DonorPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  // Redirect if user is not a donor
  React.useEffect(() => {
    if (user && user.role !== "donor") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (user && user.role !== "donor") {
    return null;
  }

  return (
    <div className="role-page">
      <h1>🍱 Donor Portal</h1>

      <nav className="sub-nav">
        <Link to="post" className="btn">📤 Post Donation</Link>
        <Link to="my-donations" className="btn">📋 My Donations</Link>
      </nav>

      <Routes>
        <Route path="post" element={<PostDonation />} />
        <Route path="my-donations" element={<MyDonations />} />
      </Routes>
    </div>
  );
}
export default DonorPage;
