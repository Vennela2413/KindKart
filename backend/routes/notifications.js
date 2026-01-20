import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get notifications for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const notifs = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Mark notification read
router.put("/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notif);
  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
