const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: { type: String, default: "" },

  completed: { type: Boolean, default: false },

  streak: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },       // 0–100 (derived from currentCount / targetCount)

  targetCount: { type: Number, default: 1 },    // how many times per day (e.g. 2 for jogging twice)
  currentCount: { type: Number, default: 0 },   // how many times completed today

  lastCompletedAt: { type: Date },
  lastResetDate: { type: Date, default: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }}
});

module.exports = mongoose.model('Habit', habitSchema);