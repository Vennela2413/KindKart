import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">KindKart</Link>

      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/profile" className="nav-item">{user.name}</Link>
            <button onClick={handleLogout} className="nav-item logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-item">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
