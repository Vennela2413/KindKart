import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const API_URL = "http://localhost:5000/api";

function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "donor" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/users/signup" : "/users/login";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "An error occurred");
        setLoading(false);
        return;
      }

      // ✅ Store user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          {isSignup && (
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
            </select>
          )}
          <button type="submit" disabled={loading}>{loading ? "Loading..." : (isSignup ? "Create Account" : "Login")}</button>
        </form>
        <p onClick={() => { setIsSignup(!isSignup); setError(""); }}>
          {isSignup ? "Already have an account? Login" : "New here? Sign Up"}
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
