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
  acceptedSubmissionsCount: {
    type: Number,
    default: 0,
  },
  
  easyProblemsSolved: {
    type: Number,
    default: 0,
  },
  mediumProblemsSolved: {
    type: Number,
    default: 0,
  },
  hardProblemsSolved: {
    type: Number,
    default: 0,
  },
  
  rankPoints: {
    type: Number,
    default: 0,
  },
  globalRank: {
    type: Number,
    default: null,
  },
  
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastSubmissionDate: {
    type: Date,
    default: null,
  },
  
  preferredLanguages: [{
    type: String,
    enum: ['javascript', 'python', 'java', 'c++', 'c', 'typescript', 'go', 'ruby', 'csharp']
  }],
  
  totalTimeSpentMinutes: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: Date,
    default: Date.now,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.virtual('accuracy').get(function() {
  if (this.totalSubmissionsCount === 0) return 0;
  return ((this.acceptedSubmissionsCount / this.totalSubmissionsCount) * 100).toFixed(2);
});

// Calculate Rank Points (Easy: 10, Medium: 25, Hard: 50)
userSchema.methods.calculateRankPoints = function() {
  return (this.easyProblemsSolved * 10) + 
         (this.mediumProblemsSolved * 25) + 
         (this.hardProblemsSolved * 50);
};


userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastDate = this.lastSubmissionDate;
  
  if (!lastDate) {
    this.currentStreak = 1;
    this.longestStreak = 1;
  } else {
    const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      this.currentStreak += 1;
      this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    } else if (daysDiff > 1) {
      this.currentStreak = 1;
    }
  }
  
  this.lastSubmissionDate = now;
};

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.model("User", userSchema);