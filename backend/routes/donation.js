import express from "express";
import Donation from "../models/Donation.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ Create donation
router.post("/", async (req, res) => {
    try {
        const { donorId, foodName, quantity, location } = req.body;
        
        if (!donorId || !foodName || !quantity || !location) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        
        const newDonation = new Donation({ 
            donorId, 
            foodName, 
            quantity, 
            location,
            status: "pending" 
        });
        
        await newDonation.save();
        res.json({ message: "Donation created successfully", donation: newDonation });
    } catch (error) {
        console.error("Create donation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get all donations
router.get("/", async (req, res) => {
    try {
        const donations = await Donation.find().populate("donorId", "name email phone").populate("ngoId", "name email phone");
        res.json(donations);
    } catch (error) {
        console.error("Get donations error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get donation by ID
router.get("/:id", async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate("donorId");
        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }
        res.json(donation);
    } catch (error) {
        console.error("Get donation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Update donation status
router.put("/:id", async (req, res) => {
    try {
        const { status, ngoId } = req.body;
        console.log("Update donation request:", { id: req.params.id, status, ngoId });

        const updates = {};
        if (status) updates.status = status;
        if (ngoId) updates.ngoId = ngoId;

        console.log("Updates object:", updates);

        const donation = await Donation.findByIdAndUpdate(req.params.id, updates, { new: true }).populate("donorId").populate("ngoId", "name email phone");

        console.log("Updated donation:", donation);

        // create notification for donor when status changes
        if (donation && donation.donorId) {
            const msg = `Your donation \"${donation.foodName}\" status changed to ${donation.status}.`;
            try {
                await Notification.create({ userId: donation.donorId._id, donationId: donation._id, message: msg });
            } catch (notifErr) {
                console.error("Failed to create notification:", notifErr);
            }
        }

        res.json({ message: "Donation updated", donation });
    } catch (error) {
        console.error("Update donation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
