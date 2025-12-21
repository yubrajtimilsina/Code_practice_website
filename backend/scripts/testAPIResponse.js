// Direct API test without starting server - simulates the exact API behavior
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DailyChallenge from '../src/features/dailyChallenge/models/DailyChallengeModel.js';
import User from '../src/features/auth/models/UserModels.js';
import Problem from '../src/features/problems/models/ProblemModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(' MongoDB connected');
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const testAPI = async () => {
  try {
    await connectDB();
    
    console.log('\n========== SIMULATING getMyHistory API CALL ==========\n');
    
    // Get user6
    const user6 = await User.findOne({ email: 'user6@example.com' });
    
    if (!user6) {
      console.log(' User6 not found!');
      process.exit(1);
    }
    
    const userId = user6._id;
    const limit = 30;
    
    console.log(' User ID:', userId);
    console.log(' User Email:', user6.email);
    console.log(' Limit:', limit);
    
    // This is exactly what the API does
    console.log('\n Executing repository query...');
    const challenges = await DailyChallenge.find({
      'completedBy.userId': userId
    })
      .sort({ date: -1 })
      .limit(limit)
      .populate({
        path: 'problemId',
        select: 'title difficulty tags description'
      })
      .populate('completedBy.userId', 'name email')
      .populate('leaderboard.userId', 'name email')
      .exec();
    
    console.log(' Query returned:', challenges.length, 'challenges');
    
    if (challenges.length === 0) {
      console.log(' ERROR: No challenges returned for user!');
      console.log('   This is why the frontend shows 0 data');
      process.exit(1);
    }
    
    // Transform data like the controller does
    console.log('\n Transforming data (like controller does)...');
    const history = challenges.map((challenge, idx) => {
      const userCompletion = challenge.completedBy.find(
        c => c.userId?._id?.toString() === userId.toString()
      );
      
      const userLeaderboardEntry = challenge.leaderboard?.find(
        entry => entry.userId?._id?.toString() === userId.toString()
      );
      
      const transformed = {
        _id: challenge._id,
        date: challenge.date,
        difficulty: challenge.difficulty,
        problemId: {
          _id: challenge.problemId?._id,
          title: challenge.problemId?.title,
          tags: challenge.problemId?.tags,
          description: challenge.problemId?.description
        },
        completedAt: userCompletion?.completedAt,
        attempts: userCompletion?.attempts || 0,
        language: userLeaderboardEntry?.language || userCompletion?.language,
        executionTime: userLeaderboardEntry?.executionTime || userCompletion?.executionTime
      };
      
      if (idx === 0) {
        console.log(' Sample transformed challenge:');
        console.log(JSON.stringify(transformed, null, 2));
      }
      
      return transformed;
    });
    
    console.log(' Transformed:', history.length, 'challenges');
    
    // Calculate stats
    console.log('\n Calculating stats...');
    const stats = {
      totalCompleted: history.length,
      currentStreak: 0,
      longestStreak: 0,
      byDifficulty: {
        Easy: 0,
        Medium: 0,
        Hard: 0
      }
    };
    
    history.forEach(challenge => {
      if (challenge.difficulty) {
        stats.byDifficulty[challenge.difficulty]++;
      }
    });
    
    if (history.length > 0) {
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 1;
      
      const sortedHistory = [...history].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCompleted = sortedHistory[0] && 
        new Date(sortedHistory[0].date).getTime() === today.getTime();
      
      if (todayCompleted) {
        currentStreak = 1;
        
        for (let i = 1; i < sortedHistory.length; i++) {
          const prevDate = new Date(sortedHistory[i - 1].date);
          const currDate = new Date(sortedHistory[i].date);
          
          const dayDiff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            currentStreak++;
            tempStreak++;
          } else {
            break;
          }
        }
      }
      
      for (let i = 1; i < sortedHistory.length; i++) {
        const prevDate = new Date(sortedHistory[i - 1].date);
        const currDate = new Date(sortedHistory[i].date);
        
        const dayDiff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      stats.currentStreak = currentStreak;
      stats.longestStreak = longestStreak;
    }
    
    console.log(' Stats calculated:');
    console.log(JSON.stringify(stats, null, 2));
    
    // Final response
    console.log('\n ========== API RESPONSE TO SEND TO FRONTEND ==========\n');
    const response = {
      history: history.slice(0, 5), // Show first 5
      stats: stats
    };
    console.log(JSON.stringify(response, null, 2));
    
    console.log('\n========== RESULT ==========');
    console.log('API is working correctly!');
    console.log(' Data is being returned!');
    console.log(' Total:', history.length, 'challenges');
    console.log(' Stats:', stats);
    console.log('\nIf frontend still shows 0, the problem is:');
    console.log('1. Frontend not calling the API');
    console.log('2. Frontend not receiving the response');
    console.log('3. Frontend not displaying the response');
    
  } catch (error) {
    console.error(' Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

testAPI();
