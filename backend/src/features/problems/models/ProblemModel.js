import mongoose from 'mongoose';
import { memo } from 'react';

const TestCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
});

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    tags: [{ type: String }],
    timeLimitSec: { type: Number, default: 1 },
    memoryLimitMB: { type: Number, default: 256 },
    sampleInput: { type: String },
    sampleOutput: { type: String },
    testCases: [TestCaseSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ProblemSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Problem', ProblemSchema);