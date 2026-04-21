const cron = require('node-cron');
const User = require('../models/User');
const { resetDailyHabits } = require('./resetDailyHabits');

const setupScheduledReset = () => {
  // Schedule job to run at midnight (00:00) every day
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running daily habit reset...`);
    
    try {
      // Get all users from your database
      const users = await User.find({});
      
      if (users.length === 0) {
        console.log('No users found to reset');
        return;
      }
      
      console.log(`Found ${users.length} users`);
      
      let totalResetCount = 0;
      
      // Reset habits for each user
      for (const user of users) {
        try {
          const result = await resetDailyHabits(user._id);
          totalResetCount += result.resetCount;
          console.log(`Reset ${result.resetCount} habits for user: ${user.email || user.username}`);
        } catch (userError) {
          console.error(`Failed to reset user ${user._id}:`, userError);
        }
      }
      
      console.log(`✅ Completed: Reset ${totalResetCount} habits across ${users.length} users`);
      
    } catch (error) {
      console.error('❌ Scheduled reset failed:', error);
    }
  });
  
  console.log('⏰ Scheduled daily habit reset at midnight');
};

module.exports = setupScheduledReset;