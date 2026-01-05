import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getUserCompletionDates } from '../src/features/dailyChallenge/repository/dailyChallengeRepository.js';
import DailyChallenge from '../src/features/dailyChallenge/models/DailyChallengeModel.js';
import User from '../src/features/auth/models/UserModels.js';
import Problem from '../src/features/problems/models/ProblemModel.js';

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

const calculateStreaks = (dates) => {
    if (!dates || dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const sortedDates = dates
        .map(d => {
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date;
        })
        .sort((a, b) => a - b);

    const uniqueDates = [];
    if (sortedDates.length > 0) {
        uniqueDates.push(sortedDates[0]);
        for (let i = 1; i < sortedDates.length; i++) {
            if (sortedDates[i].getTime() !== sortedDates[i - 1].getTime()) {
                uniqueDates.push(sortedDates[i]);
            }
        }
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0) {
            tempStreak = 1;
        } else {
            const diffTime = Math.abs(uniqueDates[i] - uniqueDates[i - 1]);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastDate = uniqueDates[uniqueDates.length - 1];

    if (lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()) {
        let activeStreak = 1;
        for (let i = uniqueDates.length - 1; i > 0; i--) {
            const diffTime = Math.abs(uniqueDates[i] - uniqueDates[i - 1]);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) activeStreak++;
            else break;
        }
        currentStreak = activeStreak;
    } else {
        currentStreak = 0;
    }

    return { currentStreak, longestStreak };
};

const verifyStreaks = async () => {
    try {
        await connectDB();

        // Setup Test User
        const user = await User.findOne({ email: 'user1@example.com' });
        if (!user) throw new Error('User 1 not found');
        console.log(`Testing with User: ${user.email}`);

        // Cleanup existing completions
        await DailyChallenge.updateMany(
            { 'completedBy.userId': user._id },
            { $pull: { completedBy: { userId: user._id } } }
        );
        console.log('Cleaned up previous completions');

        // Get a random problem to use
        const problem = await Problem.findOne();

        // Create a 3-day streak ending today
        const dates = [0, 1, 2].map(daysAgo => {
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            d.setHours(0, 0, 0, 0);
            return d;
        });

        for (const date of dates) {
            // Create or find challenge for this date
            let challenge = await DailyChallenge.findOne({ date });
            if (!challenge) {
                challenge = await DailyChallenge.create({
                    date,
                    problemId: problem._id,
                    difficulty: 'Easy',
                    expiresAt: new Date(date.getTime() + 86400000)
                });
            }

            // Add completion
            challenge.completedBy.push({
                userId: user._id,
                completedAt: new Date(),
                attempts: 1
            });
            await challenge.save();
        }
        console.log('Created 3-day streak ending today');

        // Fetch and Verify
        const completionDates = await getUserCompletionDates(user._id);
        const result = calculateStreaks(completionDates);

        console.log('Results:', result);

        if (result.currentStreak === 3) {
            console.log('✅ Current Streak Verified: 3');
        } else {
            console.log('❌ Failed: Current Streak should be 3');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyStreaks();
