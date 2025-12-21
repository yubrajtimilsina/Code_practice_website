import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DailyChallenge from '../src/features/dailyChallenge/models/DailyChallengeModel.js';
import User from '../src/features/auth/models/UserModels.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const debugDailyChallenges = async () => {
  try {
    await connectDB();
    
    // Get user6
    const user6 = await User.findOne({ email: 'user6@example.com' });
    console.log('\n=== User6 Info ===');
    console.log('Email:', user6?.email);
    console.log('ID:', user6?._id);
    console.log('Name:', user6?.name);
    
    // Check total challenges in DB
    const totalChallenges = await DailyChallenge.countDocuments();
    console.log('\n=== Total Challenges in DB ===');
    console.log('Count:', totalChallenges);
    
    // Check challenges where user6 has completions
    const user6Challenges = await DailyChallenge.find({
      'completedBy.userId': user6?._id
    }).lean();
    
    console.log('\n=== Challenges with User6 Completions ===');
    console.log('Count:', user6Challenges.length);
    
    if (user6Challenges.length > 0) {
      console.log('\nSample challenge:');
      const sample = user6Challenges[0];
      console.log('- Date:', sample.date);
      console.log('- Problem ID:', sample.problemId);
      console.log('- Completed By count:', sample.completedBy.length);
      console.log('- User6 in completedBy:', sample.completedBy.some(c => c.userId.toString() === user6?._id.toString()));
      
      const user6Entry = sample.completedBy.find(c => c.userId.toString() === user6?._id.toString());
      console.log('- User6 entry:', user6Entry);
    } else {
      console.log('\n❌ NO CHALLENGES FOUND FOR USER6!');
      console.log('\nChecking all completions in first challenge:');
      const firstChallenge = await DailyChallenge.findOne().populate('completedBy.userId', 'email name');
      if (firstChallenge) {
        console.log('- First challenge date:', firstChallenge.date);
        console.log('- Completions:', firstChallenge.completedBy.map(c => ({ 
          email: c.userId?.email, 
          name: c.userId?.name 
        })));
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugDailyChallenges();
