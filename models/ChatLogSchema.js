const mongoose = require("mongoose");

const chatLogSchema = new mongoose.Schema({
  //logId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // metaModelId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "MetaModel",
  //   required: true,
  // },
  logName: {type: String, required: true},
  userEmail: {type: String, required: true},
  metaModelName: {type: String, required: true},
  chatHistory: [{
    role: { type: String, required: true },
    parts: [{ text: { type: String, required: true } }]
  }],
});

// Add a unique compound index on userEmail, logName, and metaModelName
chatLogSchema.index(
  { userEmail: 1, logName: 1, metaModelName: 1 },
  { unique: true }
);

const ChatLog = mongoose.model("ChatLog", chatLogSchema);
module.exports = ChatLog;
