const express = require("express");
const {
  createChatLog,
  handleChatHistory,
  handleUserMessage,
  handlePrevChats,
  deleteChatLog,
} = require("../controllers/ChatLogController");

const router = express.Router();

// Create a new chat log
router.post('/createChatLog', createChatLog);

// Get a specific chat log by ID
router.get("/chatHistory/:id", handleChatHistory);

// Handle user message, store it, call external API, and append the response
router.post("/userMessage", handleUserMessage);

// Get previous chats of a particular user
router.get("/prevChats",handlePrevChats);

// Delete a specific chat log by ID
router.delete("/:logId", deleteChatLog);

module.exports = router;
