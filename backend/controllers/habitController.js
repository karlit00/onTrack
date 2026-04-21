const Habit = require("../models/Habit");
const DailyRecord = require("../models/DailyRecord");
const { resetDailyHabits } = require("../utils/resetDailyHabits");

// CREATE HABIT
exports.createHabit = async (req, res) => {
  try {
    const targetCount = Math.max(1, parseInt(req.body.targetCount) || 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habit = await Habit.create({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description || "",
      targetCount,
      currentCount: 0,
      completed: false,
      progress: 0,
      lastResetDate: today
    });

    res.status(201).json(habit);
  } catch (err) {
    console.error("Create habit error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET HABITS (with auto-reset)
exports.getHabits = async (req, res) => {
  try {
    // Reset daily habits before fetching
    await resetDailyHabits(req.user.id);
    
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (err) {
    console.error("Get habits error:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE HABIT
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // Title / description edits
    if (req.body.title !== undefined) habit.title = req.body.title;
    if (req.body.description !== undefined) habit.description = req.body.description;
    if (req.body.targetCount !== undefined) {
      habit.targetCount = Math.max(1, parseInt(req.body.targetCount) || 1);
    }

    // Handle "mark complete" press — increments currentCount by 1
    if (req.body.increment === true) {
      const wasCompleted = habit.completed;

      // Increment currentCount up to targetCount
      if (habit.currentCount < habit.targetCount) {
        habit.currentCount = Math.min(habit.currentCount + 1, habit.targetCount);
        
        // Recalculate progress (0–100)
        habit.progress = Math.round((habit.currentCount / habit.targetCount) * 100);
        
        const nowCompleted = habit.currentCount >= habit.targetCount;
        habit.completed = nowCompleted;

        // Only bump streak when crossing the completion threshold
        if (!wasCompleted && nowCompleted) {
          habit.streak += 1;
          habit.lastCompletedAt = new Date();
        }
        
        // ✅ FIXED: Save today's progress to daily record (creates if doesn't exist)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await DailyRecord.findOneAndUpdate(
  {
    userId: req.user.id,
    habitId: habit._id,
    date: today
  },
  {
    userId: req.user.id,
    habitId: habit._id,
    habitTitle: habit.title,
    date: today,
    completedCount: habit.currentCount,
    targetCount: habit.targetCount,
    wasCompleted: habit.completed,
    progress: habit.progress
  },
  { upsert: true, returnDocument: 'after' }  // ← REPLACE new: true with returnDocument: 'after'
);
      }
    }

    // Handle explicit undo / reset
    if (req.body.reset === true) {
      const wasCompleted = habit.completed;
      habit.currentCount = 0;
      habit.progress = 0;
      habit.completed = false;

      if (wasCompleted) {
        habit.streak = Math.max(habit.streak - 1, 0);
      }
      
      // ✅ FIXED: Update daily record (creates if doesn't exist)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await DailyRecord.findOneAndUpdate(
        {
          userId: req.user.id,
          habitId: habit._id,
          date: today
        },
        {
          userId: req.user.id,
          habitId: habit._id,
          habitTitle: habit.title,
          date: today,
          completedCount: 0,
          targetCount: habit.targetCount,
          wasCompleted: false,
          progress: 0
        },
        { upsert: true, new: true }
      );
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// DELETE HABIT
exports.deleteHabit = async (req, res) => {
  try {
    const deleted = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ message: "Habit not found" });

    // Delete associated daily records
    await DailyRecord.deleteMany({ habitId: req.params.id, userId: req.user.id });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete habit error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET DAILY RECORDS for calendar
exports.getDailyRecords = async (req, res) => {
  try {
    const { startDate, endDate, habitId } = req.query;
    let query = { userId: req.user.id };
    
    if (habitId) {
      query.habitId = habitId;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const records = await DailyRecord.find(query).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("Get daily records error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET USER STATS
exports.getUserStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const records = await DailyRecord.find({
      userId: req.user.id,
      date: { $gte: thirtyDaysAgo }
    });
    
    const habits = await Habit.find({ userId: req.user.id });
    
    // Calculate completion rate for last 30 days
    const totalPossibleCompletions = habits.length * 30;
    const actualCompletions = records.filter(r => r.wasCompleted).length;
    const completionRate = totalPossibleCompletions > 0 
      ? Math.round((actualCompletions / totalPossibleCompletions) * 100) 
      : 0;
    
    // Get current streak (consecutive days all habits completed)
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayRecords = records.filter(r => 
        r.date.toISOString().split('T')[0] === dateStr && r.wasCompleted
      );
      
      if (dayRecords.length === habits.length && habits.length > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    res.json({
      totalHabits: habits.length,
      totalCompletions: actualCompletions,
      completionRate,
      currentStreak,
      totalStreak: habits.reduce((acc, h) => acc + (h.streak || 0), 0)
    });
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ message: err.message });
  }
};