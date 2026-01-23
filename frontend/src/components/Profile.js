import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "./Profile.css";

const API_URL = "http://localhost:5000/api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(loggedInUser);
    setUser(userData);
    setFormData(userData);
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd send this to the backend
      localStorage.setItem("user", JSON.stringify(formData));
      setUser(formData);
      setIsEditing(false);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to update profile", type: "error" });
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>

        {!isEditing ? (
          <>
            <div className="profile-info">
              <div className="info-row">
                <label>Name:</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-row">
                <label>Email:</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-row">
                <label>Role:</label>
                <p className="role-badge">{user?.role === "donor" ? "Donor" : user?.role === "ngo" ? "NGO" : "Admin"}</p>
              </div>
              <div className="info-row">
                <label>Phone:</label>
                <p>{user?.phone || "Not provided"}</p>
              </div>
              <div className="info-row">
                <label>Address:</label>
                <p>{user?.address || "Not provided"}</p>
              </div>

              <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          </>
        ) : (
          <>
            <form className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" placeholder="Enter your phone number" value={formData.phone || ""} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea name="address" placeholder="Enter your address" rows="3" value={formData.address || ""} onChange={handleChange} />
              </div>

              <div className="form-buttons">
                <button type="button" className="btn-save" onClick={handleSave}>Save Changes</button>
                <button type="button" className="btn-cancel" onClick={() => { setIsEditing(false); setFormData(user); }}>Cancel</button>
              </div>
            </form>
          </>
        )}
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

export default Profile;
