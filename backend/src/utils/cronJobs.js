import cron from 'node-cron';
import { generateDailyChallenge, deactivateExpiredChallenges } from '../features/dailyChallenge/services/dailyChallengeService.js';

export const initializeCronJobs = () => {
  console.log(' Initializing cron jobs...');

  cron.schedule('0 0 * * *', async () => {
    console.log(' Running daily challenge generation cron job...');
    try {
      await generateDailyChallenge();
      console.log(' Daily challenge generated successfully');
    } catch (error) {
      console.error(' Failed to generate daily challenge:', error);
    }
  }, {
    timezone: "UTC"
  });

  // Deactivate expired challenges at 00:05 every day
  cron.schedule('5 0 * * *', async () => {
    console.log(' Running expired challenges cleanup...');
    try {
      await deactivateExpiredChallenges();
      console.log(' Expired challenges deactivated');
    } catch (error) {
      console.error(' Failed to deactivate expired challenges:', error);
    }
  }, {
    timezone: "UTC"
  });

  console.log(' Cron jobs initialized successfully');
  console.log('   - Daily challenge generation: 00:00 UTC');
  console.log('   - Expired challenges cleanup: 00:05 UTC');
};


export const manuallyTriggerGeneration = async () => {
  console.log(' Manually triggering daily challenge generation...');
  try {
    await generateDailyChallenge();
    console.log(' Manual generation successful');
  } catch (error) {
    console.error(' Manual generation failed:', error);
    throw error;
  }
};