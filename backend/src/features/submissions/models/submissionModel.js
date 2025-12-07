import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'c++', 'c', 'typescript', 'go', 'ruby', 'csharp'],
    required: true,
  },
  verdict: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending', 'System Error', 'Internal Error', 'Draft'],
    default: 'Pending',
  },
  status: {
    type: Number,
    default: 0,
  },
  output: {
    type: String,
    default: "",
  },
  expectedOutput: {
    type: String,
    default: "",
  },
  stderr: {
    type: String,
    default: "",
  },
  compilationError: {
    type: String,
    default: "",
  },
  executionTime: {
    type: String,
    default: "0ms",
  },
  memoryUsed: {
    type: String,
    default: "0KB",
  },
  judge0Token: {
    type: String,
    default: null,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  testsPassed: {
    type: Number,
    default: 0,
  },
  totalTests: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

});
SubmissionSchema.index({ userId: 1, problemId: 1 });
SubmissionSchema.index({ userId: 1, createdAt: -1 });
SubmissionSchema.index({ problemId: 1, isAccepted: 1 });

SubmissionSchema.pre("save", function () {
  this.updatedAt = Date.now();
});
export default mongoose.model('submission', SubmissionSchema);
