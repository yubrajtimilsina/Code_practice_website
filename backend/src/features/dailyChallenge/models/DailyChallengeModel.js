import mongoose from 'mongoose';

const DailyChallengeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  // Users who completed this challenge
  completedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission'
    },
    attempts: {
      type: Number,
      default: 1
    }
  }],
 
  leaderboard: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date
    },
    executionTime: {
      type: String
    },
    language: {
      type: String
    },
    rank: {
      type: Number
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

DailyChallengeSchema.index({ date: -1 });
DailyChallengeSchema.index({ isActive: 1, expiresAt: 1 });


DailyChallengeSchema.pre('save', function() {
  if (this.totalAttempts > 0) {
    this.completionRate = ((this.totalCompletions / this.totalAttempts) * 100).toFixed(2);
  }
});

export default mongoose.model('DailyChallenge', DailyChallengeSchema);