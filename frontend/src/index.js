import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";   // ✅ Correct relative path
import App from "./App"; // ✅ Must match capital A

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
