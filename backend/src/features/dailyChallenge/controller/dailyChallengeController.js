import { 
  getTodayChallenge as getTodayChallengeService,
  hasUserCompletedToday,
  generateDailyChallenge
} from '../services/dailyChallengeService.js';
import {
  findAllChallenges,
  findChallengeByDate,
  getChallengeLeaderboard,
  getUserChallengeHistory,
  addChallengeCompletion,
  incrementChallengeAttempt
} from '../repository/dailyChallengeRepository.js';
import User from '../../auth/models/UserModels.js';

export const getTodayChallenge = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    let challenge = await getTodayChallengeService();
    
    if (!challenge) {
      return res.status(404).json({ 
        error: "No daily challenge available today" 
      });
    }
    
   
    if (challenge.problemId && typeof challenge.problemId === 'object') {
      // Already populated
    } else {
      
      challenge = await challenge.populate('problemId');
    }

    const hasCompleted = userId ? await hasUserCompletedToday(userId) : false;
    const userAttempts = challenge.completedBy
      .filter(c => c.userId?.toString() === userId?.toString())
      .reduce((sum, c) => sum + c.attempts, 0);
    
    // Get user's rank if completed
    let userRank = null;
    if (hasCompleted) {
      const leaderboardEntry = challenge.leaderboard.find(
        entry => entry.userId?.toString() === userId?.toString()
      );
      userRank = leaderboardEntry?.rank || null;
    }
    
    res.json({
      challenge: {
        _id: challenge._id,
        date: challenge.date,
        problem: challenge.problemId ? {
          _id: challenge.problemId._id,
          title: challenge.problemId.title,
          description: challenge.problemId.description,
          difficulty: challenge.problemId.difficulty,
          tags: challenge.problemId.tags,
          examples: challenge.problemId.examples,
          constraints: challenge.problemId.constraints,
          sampleInput: challenge.problemId.sampleInput,
          sampleOutput: challenge.problemId.sampleOutput,
          timeLimitSec: challenge.problemId.timeLimitSec,
          memoryLimitMB: challenge.problemId.memoryLimitMB
        } : null,
        difficulty: challenge.difficulty,
        totalAttempts: challenge.totalAttempts,
        totalCompletions: challenge.totalCompletions,
        completionRate: challenge.completionRate,
        expiresAt: challenge.expiresAt,
        participantsCount: challenge.completedBy.length
      },
      userProgress: {
        hasCompleted,
        attempts: userAttempts,
        rank: userRank
      }
    });
    
  } catch (error) {
    console.error('Get today challenge error:', error);
    res.status(500).json({ error: 'Failed to fetch daily challenge' });
  }
};

export const getChallengeHistory = async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    
    const challenges = await findAllChallenges(parseInt(limit));
    
    res.json({
      challenges,
      count: challenges.length
    });
    
  } catch (error) {
    console.error('Get challenge history error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge history' });
  }
};

export const getChallengeByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    const challengeDate = new Date(date);
    challengeDate.setHours(0, 0, 0, 0);
    
    const challenge = await findChallengeByDate(challengeDate);
    
    if (!challenge) {
      return res.status(404).json({ 
        error: 'No challenge found for this date' 
      });
    }
    
    res.json({ challenge });
    
  } catch (error) {
    console.error('Get challenge by date error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
};


export const getDailyChallengeLeaderboard = async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    const leaderboard = await getChallengeLeaderboard(challengeId);
    
    res.json({
      leaderboard,
      count: leaderboard.length
    });
    
  } catch (error) {
    console.error('Get challenge leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

export const getMyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 30 } = req.query;
    
    console.log(' ========== GET MY HISTORY DEBUG ==========');
    console.log(' User ID:', userId);
    console.log(' User object:', req.user);
    console.log(' Limit:', limit);
    
    const challenges = await getUserChallengeHistory(userId, parseInt(limit));
    
    console.log(' Challenges found:', challenges.length);
    if (challenges.length > 0) {
      console.log(' First challenge:', {
        _id: challenges[0]._id,
        date: challenges[0].date,
        problemId: challenges[0].problemId?.title,
        completedByCount: challenges[0].completedBy?.length,
        leaderboardCount: challenges[0].leaderboard?.length
      });
    } else {
      console.log(' No challenges found for this user!');
    }
    
    // Transform challenges to extract user-specific completion data
    const history = challenges.map((challenge, idx) => {
      const userCompletion = challenge.completedBy.find(
        c => c.userId?.toString() === userId.toString()
      );
      
      // Also find in leaderboard for language and executionTime
      const userLeaderboardEntry = challenge.leaderboard?.find(
        entry => entry.userId?.toString() === userId.toString()
      );
      
      const transformedChallenge = {
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
        console.log(' Sample transformed challenge:', transformedChallenge);
        console.log(' User completion:', userCompletion);
        console.log(' Leaderboard entry:', userLeaderboardEntry);
      }
      
      return transformedChallenge;
    });
    
    console.log(' Transformed history count:', history.length);
    
    // Calculate stats
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
    
    // Count by difficulty
    history.forEach(challenge => {
      if (challenge.difficulty) {
        stats.byDifficulty[challenge.difficulty]++;
      }
    });
    
    // Calculate streaks
    if (history.length > 0) {
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 1;
      
      const sortedHistory = [...history].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      // Check if today's challenge is completed
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCompleted = sortedHistory[0] && 
        new Date(sortedHistory[0].date).getTime() === today.getTime();
      
      if (todayCompleted) {
        currentStreak = 1;
        
        // Count consecutive days
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
      
      // Calculate longest streak
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
    
    res.json({
      history,
      stats
    });
    
  } catch (error) {
    console.error('Get my history error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge history' });
  }
};

export const completeDailyChallenge = async (req, res) => {
  try {
    const { submissionId, executionTime, language } = req.body;
    const userId = req.user._id;
    
    const challenge = await getTodayChallengeService();
    
    if (!challenge) {
      return res.status(404).json({ 
        error: 'No active daily challenge found' 
      });
    }
    
    // Add completion
    const updatedChallenge = await addChallengeCompletion(
      challenge._id,
      userId,
      submissionId,
      executionTime,
      language
    );
    
    // Update user's daily challenge stats
    const user = await User.findById(userId);
    if (user) {
      user.dailyChallengesCompleted = (user.dailyChallengesCompleted || 0) + 1;
      user.lastDailyChallengeDate = new Date();
      await user.save();
    }
    
    res.json({
      message: 'Daily challenge completed!',
      challenge: updatedChallenge,
      rank: updatedChallenge.leaderboard.find(
        entry => entry.userId.toString() === userId.toString()
      )?.rank
    });
    
  } catch (error) {
    console.error('Complete daily challenge error:', error);
    res.status(500).json({ error: 'Failed to complete daily challenge' });
  }
};


export const manuallyGenerateChallenge = async (req, res) => {
  try {
    const challenge = await generateDailyChallenge();
    
    res.json({
      message: 'Daily challenge generated successfully',
      challenge
    });
    
  } catch (error) {
    console.error('Generate challenge error:', error);
    res.status(500).json({ error: 'Failed to generate daily challenge' });
  }
};