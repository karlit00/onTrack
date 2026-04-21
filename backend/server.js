const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ---------------------------
   Middleware
---------------------------- */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://on-track-six.vercel.app",
    "https://on-track-nam7rek4a-kode3.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

/* ---------------------------
   MongoDB Connection
---------------------------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

/* ---------------------------
   Routes
---------------------------- */

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Habit Tracker Backend API is running'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));

/* ---------------------------
   Scheduled Reset
---------------------------- */
const setupScheduledReset = require('./utils/scheduledReset');

/* ---------------------------
   Start Server
---------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start cron job after server starts
  setupScheduledReset();
});