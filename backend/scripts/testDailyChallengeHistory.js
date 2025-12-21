// Test script to diagnose Daily Challenge History data issues
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
    console.error(' MongoDB connection failed:', error);
    process.exit(1);
  }
};

const runDiagnostics = async () => {
  try {
    await connectDB();
    
    console.log('\n========== DAILY CHALLENGE HISTORY DIAGNOSTICS ==========\n');
    
    // 1. Check if users exist
    console.log('1️  CHECKING USERS...');
    const user6 = await User.findOne({ email: 'user6@example.com' });
    console.log(' User6 found:', user6 ? ' YES' : ' NO');
    if (user6) {
      console.log('   Email:', user6.email);
      console.log('   ID:', user6._id);
      console.log('   Name:', user6.name);
    } else {
      console.log(' User6 does not exist! Create users first with: npm run seed');
    }
    
    // 2. Check if daily challenges exist
    console.log('\n2️  CHECKING DAILY CHALLENGES...');
    const totalChallenges = await DailyChallenge.countDocuments();
    console.log(' Total challenges in DB:', totalChallenges);
    
    if (totalChallenges === 0) {
      console.log(' NO CHALLENGES FOUND! Run: npm run seed');
      process.exit(0);
    }
    
    // 3. Check challenges with any completions
    console.log('\n3️  CHECKING CHALLENGES WITH COMPLETIONS...');
    const challengesWithCompletions = await DailyChallenge.find({
      'completedBy': { $exists: true, $ne: [] }
    }).countDocuments();
    console.log(' Challenges with completions:', challengesWithCompletions);
    
    // 4. Check completions for user6 specifically
    if (user6) {
      console.log('\n4️  CHECKING USER6 COMPLETIONS...');
      const user6Completions = await DailyChallenge.countDocuments({
        'completedBy.userId': user6._id
      });
      console.log(' Challenges completed by user6:', user6Completions);
      
      if (user6Completions > 0) {
        console.log(' User6 HAS completions!');
        
        // Get first completion for detailed check
        const firstCompletion = await DailyChallenge.findOne({
          'completedBy.userId': user6._id
        })
          .populate('problemId', 'title difficulty tags')
          .populate('completedBy.userId', 'name email');
        
        if (firstCompletion) {
          console.log('\n Sample Challenge Details:');
          console.log('   Date:', firstCompletion.date);
          console.log('   Problem:', firstCompletion.problemId?.title);
          console.log('   Difficulty:', firstCompletion.difficulty);
          
          const user6Entry = firstCompletion.completedBy.find(
            c => c.userId._id.toString() === user6._id.toString()
          );
          
          console.log('   User6 Entry:', {
            completedAt: user6Entry?.completedAt,
            attempts: user6Entry?.attempts,
            userId: user6Entry?.userId?.name
          });
        }
      } else {
        console.log(' User6 has NO completions!');
        console.log('   This is the problem! User6 needs challenge completions.');
        
        // Show which users DO have completions
        console.log('\n Users who DO have completions:');
        const pipeline = [
          { $unwind: '$completedBy' },
          {
            $group: {
              _id: '$completedBy.userId',
              challengeCount: { $sum: 1 }
            }
          },
          { $sort: { challengeCount: -1 } },
          { $limit: 5 }
        ];
        
        const topUsers = await DailyChallenge.aggregate(pipeline);
        
        for (const userStat of topUsers) {
          const user = await User.findById(userStat._id);
          console.log(`   ${user?.email}: ${userStat.challengeCount} challenges`);
        }
      }
    }
    
    // 5. Check if problems are populated
    console.log('\n5️  CHECKING PROBLEM POPULATION...');
    const challengeWithoutProblem = await DailyChallenge.findOne({
      problemId: null
    });
    if (challengeWithoutProblem) {
      console.log('  Found challenges with NULL problemId!');
    } else {
      console.log(' All challenges have problems');
    }
    
    // 6. Sample API call simulation
    if (user6) {
      console.log('\n6️  SIMULATING API RESPONSE...');
      const challenges = await DailyChallenge.find({
        'completedBy.userId': user6._id
      })
        .sort({ date: -1 })
        .limit(5)
        .populate('problemId', 'title difficulty tags description')
        .populate('completedBy.userId', 'name email')
        .populate('leaderboard.userId', 'name email');
      
      console.log(' API would return:', challenges.length, 'challenges');
      
      if (challenges.length > 0) {
        const transformed = challenges.map(challenge => {
          const userCompletion = challenge.completedBy.find(
            c => c.userId._id.toString() === user6._id.toString()
          );
          const userLeaderboard = challenge.leaderboard?.find(
            e => e.userId._id.toString() === user6._id.toString()
          );
          
          return {
            title: challenge.problemId?.title,
            completedAt: userCompletion?.completedAt,
            language: userLeaderboard?.language,
            executionTime: userLeaderboard?.executionTime
          };
        });
        
        console.log(' Transformed response:');
        console.log(JSON.stringify(transformed, null, 2));
      }
    }
    
    console.log('\n========== DIAGNOSIS COMPLETE ==========\n');
    
  } catch (error) {
    console.error(' Error during diagnostics:', error);
  } finally {
    await mongoose.disconnect();
  }
};

runDiagnostics();
