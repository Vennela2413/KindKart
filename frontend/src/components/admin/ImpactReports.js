import React, { useEffect, useState } from "react";
import "../ngo/NGOStyles.css";

const API_URL = "http://localhost:5000/api";

function ImpactReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      const donations = await fetch(`${API_URL}/donations`).then(r => r.json());
      const users = await fetch(`${API_URL}/users`).then(r => r.json());

      const collected = donations.filter(d => d.status === "collected");
      const totalMeals = donations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0);
      const collectedMeals = collected.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0);
      
      // Calculate metrics
      const totalDonations = donations.length;
      const collectionRate = totalDonations > 0 ? Math.round((collected.length / totalDonations) * 100) : 0;
      const avgMealsPerDonation = totalDonations > 0 ? Math.round(totalMeals / totalDonations) : 0;
      const foodWastePreventedKg = collectedMeals * 0.35; // Estimate 350g per meal
      
      // Monthly stats (simplified - last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentDonations = donations.filter(d => new Date(d.createdAt) > thirtyDaysAgo);
      const recentCollected = recentDonations.filter(d => d.status === "collected");

      setData({
        totalDonations,
        collectedDonations: collected.length,
        pendingDonations: donations.filter(d => d.status === "pending").length,
        collectionRate,
        totalMeals,
        collectedMeals,
        avgMealsPerDonation,
        foodWastePreventedKg: Math.round(foodWastePreventedKg),
        totalNGOs: users.filter(u => u.role === "ngo").length,
        totalDonors: users.filter(u => u.role === "donor").length,
        monthlyDonations: recentDonations.length,
        monthlyCollected: recentCollected.length,
        monthlyMeals: recentDonations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0)
      });
    } catch (err) {
      console.error("Failed to fetch impact data", err);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading impact reports...</div>;
  if (!data) return <div className="loading">No data available</div>;

  return (
    <div className="donations-container" style={{ paddingTop: 30 }}>
      <h2>📊 Impact Reports</h2>
      <p className="subtitle">Track the positive impact of Food Rescue</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 40 }}>
        <ReportCard icon="🍽️" title="Total Meals Saved" value={data.totalMeals} unit="portions" />
        <ReportCard icon="✓" title="Successfully Collected" value={data.collectedMeals} unit="portions" />
        <ReportCard icon="♻️" title="Food Waste Prevented" value={data.foodWastePreventedKg} unit="kg" />
        <ReportCard icon="📈" title="Collection Rate" value={data.collectionRate} unit="%" />
        <ReportCard icon="📦" title="Total Donations" value={data.totalDonations} unit="donations" />
        <ReportCard icon="🏥" title="Active NGOs" value={data.totalNGOs} unit="organizations" />
        <ReportCard icon="🍽️" title="Active Donors" value={data.totalDonors} unit="people" />
        <ReportCard icon="⏳" title="Avg Meals/Donation" value={data.avgMealsPerDonation} unit="meals" />
      </div>

      <h3>📅 Last 30 Days</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
        <MetricBox label="New Donations" value={data.monthlyDonations} color="#667eea" />
        <MetricBox label="Collections" value={data.monthlyCollected} color="#28a745" />
        <MetricBox label="Meals Served" value={data.monthlyMeals} color="#ffa500" />
        <MetricBox label="Monthly Collection Rate" value={data.monthlyDonations > 0 ? Math.round((data.monthlyCollected / data.monthlyDonations) * 100) : 0} suffix="%" color="#764ba2" />
      </div>

      <div className="impact-insights">
        <h3>💡 Key Insights</h3>
        <ul>
          <li>✅ {data.collectedMeals} meals successfully prevented from going to waste</li>
          <li>✅ Equivalent to saving {Math.round(data.foodWastePreventedKg)} kg of food</li>
          <li>✅ {data.totalDonors} donors sharing surplus food with communities</li>
          <li>✅ {data.totalNGOs} NGOs actively collecting and distributing food</li>
          <li>✅ {data.collectionRate}% of donations successfully collected</li>
          {data.collectionRate < 80 && <li>⚠️ Focus on improving collection rate by monitoring abandoned donations</li>}
        </ul>
      </div>
    </div>
  );
}

function ReportCard({ icon, title, value, unit }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "25px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.2)"
    }}>
      <div style={{ fontSize: "32px", marginBottom: "10px" }}>{icon}</div>
      <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "5px" }}>{title}</div>
      <div style={{ fontSize: "28px", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "11px", opacity: 0.85 }}>{unit}</div>
    </div>
  );
}

function MetricBox({ label, value, suffix = "", color }) {
  return (
    <div style={{
      background: "white",
      border: `3px solid ${color}`,
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>{label}</div>
      <div style={{ fontSize: "32px", fontWeight: "bold", color }}>
        {value}{suffix}
      </div>
    </div>
  );
}

export default ImpactReports;
