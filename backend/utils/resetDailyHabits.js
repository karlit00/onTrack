const Habit = require("../models/Habit");
const DailyRecord = require("../models/DailyRecord");

const resetDailyHabits = async (userId) => {
  try {
    const habits = await Habit.find({ userId });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let resetCount = 0;

    for (const habit of habits) {
      const lastReset = habit.lastResetDate ? new Date(habit.lastResetDate) : null;
      
      // Check if habit needs reset (different day)
      if (!lastReset || lastReset.getTime() !== today.getTime()) {
        
        // Save today's completion record before resetting
        const existingRecord = await DailyRecord.findOne({
          userId,
          habitId: habit._id,
          date: lastReset || today
        });

        if (!existingRecord && (habit.currentCount > 0 || habit.completed)) {
          await DailyRecord.create({
            userId,
            habitId: habit._id,
            habitTitle: habit.title,
            date: lastReset || today,
            completedCount: habit.currentCount,
            targetCount: habit.targetCount,
            wasCompleted: habit.completed,
            progress: habit.progress
          });
        }

        // Reset the habit for today
        const wasCompleted = habit.completed;
        habit.currentCount = 0;
        habit.progress = 0;
        habit.completed = false;
        
        // Decrease streak if previous day wasn't completed
        if (!wasCompleted && habit.streak > 0) {
          habit.streak = Math.max(0, habit.streak - 1);
        }
        
        habit.lastResetDate = today;
        await habit.save();
        resetCount++;
      }
    }
    
    return { resetCount, message: `Reset ${resetCount} habits for today` };
  } catch (error) {
    console.error("Error resetting daily habits:", error);
    throw error;
  }
};

module.exports = { resetDailyHabits };