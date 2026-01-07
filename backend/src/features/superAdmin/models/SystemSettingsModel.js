import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: "CodePractice",
    },
    maintenanceMode: {
        type: Boolean,
        default: false,
    },
    allowRegistration: {
        type: Boolean,
        default: true,
    },
    contestMode: {
        type: Boolean,
        default: false,
    },
    judge0Config: {
        apiKey: String,
        endpoint: String,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model("SystemSettings", systemSettingsSchema);
