import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodName: { type: String, required: true },
    quantity: String,
    expiryTime: Date,
    imageUrl: String,
    location: String,
    status: { type: String, enum: ["pending","accepted","collected"], default: "pending" },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Donation", DonationSchema);
