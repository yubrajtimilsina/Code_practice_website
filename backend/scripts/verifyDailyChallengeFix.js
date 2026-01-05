import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { processDailyChallengeCompletion, getTodayChallenge } from '../src/features/dailyChallenge/services/dailyChallengeService.js';
import User from '../src/features/auth/models/UserModels.js';
import DailyChallenge from '../src/features/dailyChallenge/models/DailyChallengeModel.js';

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

const verifyFix = async () => {
    try {
        await connectDB();

        // 1. Get a user (User 1)
        const user = await User.findOne({ email: 'user1@example.com' });
        if (!user) {
            console.error('User 1 not found');
            process.exit(1);
        }
        console.log(`Testing with User: ${user.email} (${user._id})`);

        // 2. Get today's challenge
        const challenge = await getTodayChallenge();
        console.log('Today\'s Challenge Problem ID:', challenge.problemId._id);

        // 3. Cleanup: Remove any existing completion for this user today to ensure clean test
        await DailyChallenge.updateOne(
            { _id: challenge._id },
            { $pull: { completedBy: { userId: user._id }, leaderboard: { userId: user._id } } }
        );
        console.log('Cleaned up previous completions for today');

        // 4. Simulate a successful submission for the correct problem
        console.log('Simulating successful submission for the Daily Challenge problem...');
        const result = await processDailyChallengeCompletion(
            user._id,
            new mongoose.Types.ObjectId(), // Mock submission ID
            challenge.problemId._id,
            "10ms",
            "javascript"
        );

        // 5. Verify result
        if (result) {
            console.log('✅ processDailyChallengeCompletion returned success!');

            const updatedChallenge = await DailyChallenge.findById(challenge._id);
            const isCompleted = updatedChallenge.completedBy.some(c => c.userId.toString() === user._id.toString());
            console.log(`Challenge marked as completed in DB: ${isCompleted ? 'YES' : 'NO'}`);

            const updatedUser = await User.findById(user._id);
            console.log(`User dailyChallengesCompleted: ${updatedUser.dailyChallengesCompleted}`);
            console.log(`User lastDailyChallengeDate: ${updatedUser.lastDailyChallengeDate}`);

        } else {
            console.log('❌ processDailyChallengeCompletion returned null (failed)');
        }

        // 6. Test negative case: Wrong problem ID
        console.log('\nTesting Negative Case (Wrong Problem ID)...');
        const wrongResult = await processDailyChallengeCompletion(
            user._id,
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(), // Random problem ID
            "10ms",
            "javascript"
        );

        if (wrongResult === null) {
            console.log('✅ Correctly ignored submission for different problem');
        } else {
            console.log('❌ Incorrectly processed submission for different problem');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyFix();
