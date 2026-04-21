const mongoose = require('mongoose');

const dailyRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  habitId: { type: String, required: true },
  habitTitle: { type: String, required: true },
  date: { type: Date, required: true },
  completedCount: { type: Number, default: 0 },
  targetCount: { type: Number, default: 1 },
  wasCompleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Create compound index for efficient queries
dailyRecordSchema.index({ userId: 1, habitId: 1, date: 1 });
dailyRecordSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('DailyRecord', dailyRecordSchema);