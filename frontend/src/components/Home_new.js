import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const API_URL = "http://localhost:5000/api";

function Home() {
  const [stats, setStats] = useState({ donations: 0, meals: 0, ngos: 0, donors: 0 });

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const donationsRes = await fetch(`${API_URL}/donations`);
        const donations = await donationsRes.json();
        
        const usersRes = await fetch(`${API_URL}/users`);
        const users = await usersRes.json();

        const ngoCount = users.filter(u => u.role === "ngo").length;
        const donorCount = users.filter(u => u.role === "donor").length;
        const mealCount = donations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0);

        setStats({
          donations: donations.length,
          meals: mealCount,
          ngos: ngoCount,
          donors: donorCount
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>🌱 Food Rescue</h1>
          <p className="hero-subtitle">Reduce Food Waste. Feed Communities. Save Lives.</p>
          <p className="hero-description">
            Connect surplus food from events and restaurants with NGOs and communities in need. 
            Every meal counts!
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <Link to="/dashboard" className="btn-secondary">Learn More</Link>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1488459716781-6c52da20d868?auto=format&fit=crop&w=600&q=80"
          alt="Food donation"
          className="hero-image"
        />
      </div>

      {/* Features Section */}
      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>For Donors</h3>
            <p>Restaurants and individuals upload excess food from events with location details</p>
            <ul>
              <li>✓ Easy posting</li>
              <li>✓ Real-time updates</li>
              <li>✓ Track donations</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>For NGOs</h3>
            <p>Browse nearby food donations and collect them for communities in need</p>
            <ul>
              <li>✓ View nearby donations</li>
              <li>✓ Filter by location</li>
              <li>✓ Collect and track</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Impact Tracking</h3>
            <p>Monitor food waste reduction and community reach in real-time</p>
            <ul>
              <li>✓ Donation stats</li>
              <li>✓ Impact reports</li>
              <li>✓ Community reach</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat">
          <h3>{stats.donations}+</h3>
          <p>Food Donations</p>
        </div>
        <div className="stat">
          <h3>{stats.meals}+</h3>
          <p>Meals Saved</p>
        </div>
        <div className="stat">
          <h3>{stats.ngos}+</h3>
          <p>Active NGOs</p>
        </div>
        <div className="stat">
          <h3>{stats.donors}+</h3>
          <p>Donors</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Make a Difference?</h2>
        <p>Join thousands of donors and NGOs working together to eliminate food waste</p>
        <Link to="/login" className="btn-primary">Join Now</Link>
      </section>
    </div>
  );
}

export default Home;
