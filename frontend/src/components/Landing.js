import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero-landing">
        <div className="hero-content">
          <h1 className="hero-title">Share Kindness, Make a Difference</h1>
          <p className="hero-tagline">
            Donate food, clothes, toys, and essentials to help those in need
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-donate">
              Donate Now
            </Link>
            <a href="#features" className="btn btn-learn">
              Learn More
            </a>
          </div>
        </div>

        <div className="hero-visual">
         <img src="/images/kindkart.jpeg" alt="KindKart Hero" className="hero-image-landing"  style={{ width: "500px", height: "auto", borderRadius: "20px" }}/>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-landing" id="features">
        <h2>What You Can Share</h2>
        <div className="feature-cards">
          {/* Food Card */}
          <div className="feature-card-landing food-card">
            <div className="card-icon">
              <img
                src="/images/food donation.jpeg"
                alt="food donation"
                className="card-img"
              />
            </div>
            <h3>Food & Meals</h3>
            <p>
              Share surplus meals, groceries, and prepared food from restaurants and homes.
            </p>
            <div className="card-highlight">Easy · Quick · Impactful</div>
          </div>

          {/* Clothes Card */}
          <div className="feature-card-landing clothes-card">
            <div className="card-icon">
              <img
                src="/images/clothes donation.jpeg"
                alt="clothes donation"
                className="card-img"
              />
            </div>
            <h3>Clothes & Textiles</h3>
            <p>
              Donate gently used clothing, shoes, and accessories to those in need.
            </p>
            <div className="card-highlight">Seasonal · All Sizes · Fresh</div>
          </div>

          {/* Toys Card */}
          <div className="feature-card-landing toys-card">
            <div className="card-icon">
              <img
                src="/images/toys donation.jpeg"
                alt="toys donation"
                className="card-img"
              />
            </div>
            <h3>Toys & Books</h3>
            <p>
              Share educational toys, books, and games to brighten children's lives.
            </p>
            <div className="card-highlight">Learning · Fun · Joy</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account as a donor or NGO</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>List Items</h3>
            <p>Post what you want to donate</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Connect</h3>
            <p>Get matched with those who need help</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Impact</h3>
            <p>Make a real difference in your community</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-landing">
        <div className="stat-item">
          <h4>1000+</h4>
          <p>Donations Made</p>
        </div>
        <div className="stat-item">
          <h4>5000+</h4>
          <p>Lives Touched</p>
        </div>
        <div className="stat-item">
          <h4>50+</h4>
          <p>Partner NGOs</p>
        </div>
        <div className="stat-item">
          <h4>100%</h4>
          <p>Free to Use</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-landing">
        <h2>Ready to Spread Kindness?</h2>
        <p>
          Join our community of changemakers and make a real difference today.
        </p>
        <Link to="/login" className="btn btn-cta">
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2025 KindKart. Spreading kindness, one donation at a time.</p>
      </footer>
    </div>
  );
}

export default Landing;
