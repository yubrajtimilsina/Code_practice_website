import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["learner", "admin", "super-admin"],
        default: "learner",
    },

    isActive: {
    type: Boolean,
    default: true,
  },
  solvedProblemsCount: {
    type: Number,
    default: 0,
  },
  totalSubmissionsCount: {
    type: Number,
    default: 0,
  },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("User", userSchema);