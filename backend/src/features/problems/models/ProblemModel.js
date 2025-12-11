import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
});

const ExampleSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String }
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

    examples: [ExampleSchema],
    constraints: [{ type: String }], 
    hints: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 }
});

ProblemSchema.pre('save', function () {
    this.updatedAt = Date.now();

     if (this.totalSubmissions > 0) {
        this.acceptanceRate = ((this.acceptedSubmissions / this.totalSubmissions) * 100).toFixed(2);
    }
});

export default mongoose.model('Problem', ProblemSchema);