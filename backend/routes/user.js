import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ✅ Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // ✅ Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        res.json({ 
            message: "Login successful", 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        // ✅ Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ name, email, password: hashedPassword, role: role || "donor" });
        await newUser.save();
        
        res.json({ 
            message: "Signup successful", 
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;


