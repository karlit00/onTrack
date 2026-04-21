const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Add health check endpoint (useful for later)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));

// Import scheduled reset
const setupScheduledReset = require('./utils/scheduledReset');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the scheduled reset AFTER server is running
  setupScheduledReset();
});