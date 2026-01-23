import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DonateForm from "./components/DonateForm";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Landing from "./components/Landing";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./components/Dashboard";
import DonorPage from "./components/DonorPage";
import NGOPage from "./components/NGOPage";
import AdminPage from "./components/AdminPage";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/donor/*" element={<DonorPage />} />
        <Route path="/ngo/*" element={<NGOPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/donate" element={<DonateForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
