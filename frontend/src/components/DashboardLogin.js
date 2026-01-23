import React from "react";
import "./DashboardLogin.css"; // optional if you add styles

function DashboardLogin() {
  return (
    <div className="login-page" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Dashboard Login</h2>
      <form style={{ display: "inline-block", textAlign: "left" }}>
        <label>Email:</label><br />
        <input type="email" placeholder="Enter your email" required /><br /><br />

        <label>Password:</label><br />
        <input type="password" placeholder="Enter your password" required /><br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default DashboardLogin;
