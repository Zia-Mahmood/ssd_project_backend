const express = require("express");
const router = express.Router();
const {
  getSummariesSubmittedToUser,
} = require("../controllers/SummaryController");

// Get all summaries submitted to a specific user
router.get("/submittedTo/:userId", getSummariesSubmittedToUser);

module.exports = router;
