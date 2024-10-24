const mongoose = require("mongoose");

const chatLogSchema = new mongoose.Schema({
  logId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  metaModelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaModel",
    required: true,
  },
  chatHistory: { type: [String], required: true },
});

const ChatLog = mongoose.model("ChatLog", chatLogSchema);
module.exports = ChatLog;
