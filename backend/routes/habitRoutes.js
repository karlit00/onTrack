const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const habitController = require("../controllers/habitController");

router.post("/", auth, habitController.createHabit);
router.get("/", auth, habitController.getHabits);
router.patch("/:id", auth, habitController.updateHabit);
router.delete("/:id", auth, habitController.deleteHabit);

// NEW ROUTES for daily records and stats
router.get("/records", auth, habitController.getDailyRecords);
router.get("/stats", auth, habitController.getUserStats);

module.exports = router;