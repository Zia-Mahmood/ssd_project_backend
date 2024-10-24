const express = require("express");
const {
  createChatLog,
  getChatLogById,
  handleUserMessage,
  deleteChatLog,
} = require("../controllers/ChatLogController");

const router = express.Router();

// Create a new chat log
router.post("/", createChatLog);

// Get a specific chat log by ID
router.get("/:logId", getChatLogById);

// Handle user message, store it, call external API, and append the response
router.post("/:logId", handleUserMessage);

// Delete a specific chat log by ID
router.delete("/:logId", deleteChatLog);

module.exports = router;
