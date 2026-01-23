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
          <h1>KindKart</h1>
          <p className="hero-subtitle">Delivering Kindness</p>
          <p className="hero-description">
            Share food, clothes, toys, and essentials with those in need. Every act of kindness counts!
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <a href="#how-it-works" className="btn-secondary">Learn More</a>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1488459716781-6c52da20d868?auto=format&fit=crop&w=600&q=80"
          alt="Food donation"
          className="hero-image"
        />
      </div>

      {/* Features Section */}
      <section className="features" id="how-it-works">
        <h2>What You Can Share</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Food & Meals</h3>
            <p>Share surplus meals, groceries, and prepared food from restaurants and events</p>
            <ul>
              <li>✓ Easy posting</li>
              <li>✓ Real-time updates</li>
              <li>✓ Track donations</li>
            </ul>
            <img 
              src="https://images.unsplash.com/photo-1504674900967-0e334e4ad2f4?auto=format&fit=crop&w=400&q=80" 
              alt="Food" 
              className="feature-image"
            />
          </div>

          <div className="feature-card">
            <div className="feature-icon">👕</div>
            <h3>Clothes & Textiles</h3>
            <p>Donate gently used clothing, shoes, and accessories to those in need</p>
            <ul>
              <li>✓ Multiple sizes</li>
              <li>✓ Seasonal items</li>
              <li>✓ Quick matching</li>
            </ul>
            <img 
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80" 
              alt="Clothes" 
              className="feature-image"
            />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧸</div>
            <h3>Toys & Books</h3>
            <p>Share educational toys, books, and games to brighten children's lives</p>
            <ul>
              <li>✓ Age-appropriate</li>
              <li>✓ Educational value</li>
              <li>✓ Community impact</li>
            </ul>
            <img 
              src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80" 
              alt="Toys" 
              className="feature-image"
            />
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
