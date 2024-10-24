const ChatLog = require("./models/ChatLog"); // Adjust the path if needed

// Create a new chat log
const createChatLog = async (req, res) => {
  const { userId, metaModelId, chatHistory } = req.body;

  try {
    const newChatLog = new ChatLog({ userId, metaModelId, chatHistory });
    const savedChatLog = await newChatLog.save();
    res.status(201).json(savedChatLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific chat log by ID
const getChatLogById = async (req, res) => {
  const { logId } = req.params;

  try {
    const chatLog = await ChatLog.findById(logId).populate(
      "userId metaModelId"
    );
    if (!chatLog) {
      return res.status(404).json({ message: "Chat log not found" });
    }
    res.status(200).json(chatLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Append a new message to chat history
const appendToChatHistory = async (logId, newMessage) => {
  try {
    const chatLog = await ChatLog.findById(logId);
    if (!chatLog) {
      throw new Error("Chat log not found");
    }
    chatLog.chatHistory.push(newMessage);
    await chatLog.save();
    return chatLog; // Return updated chat log
  } catch (error) {
    throw new Error(error.message);
  }
};

// Handle user message, store it, call external API, and append the response
const handleUserMessage = async (req, res) => {
  const { logId } = req.params;
  const { userMessage } = req.body; // Expecting user message in the body

  try {
    // Append the user message to chatHistory
    const userFormattedMessage = `you: ${userMessage}`;
    await appendToChatHistory(logId, userFormattedMessage);

    // Call the chat API (simulate API call for demonstration)
    // Replace with your actual API call logic
    const apiResponse = { data: { response: "Hello from API!" } }; // Placeholder for API response

    // Append the API response to chatHistory
    const botFormattedMessage = `bot: ${apiResponse.data.response}`; // Adjust based on the actual API response structure
    const updatedChatLog = await appendToChatHistory(
      logId,
      botFormattedMessage
    );

    // Respond with the API response
    res.status(200).json({
      apiResponse: apiResponse.data.response, // Send back the API response to the user
      chatLog: updatedChatLog,
    });
  } catch (error) {
    if (error.message === "Chat log not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific chat log by ID
const deleteChatLog = async (req, res) => {
  const { logId } = req.params;

  try {
    const deletedChatLog = await ChatLog.findByIdAndDelete(logId);
    if (!deletedChatLog) {
      return res.status(404).json({ message: "Chat log not found" });
    }
    res.status(200).json({ message: "Chat log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChatLog,
  getChatLogById,
  handleUserMessage,
  deleteChatLog,
};
