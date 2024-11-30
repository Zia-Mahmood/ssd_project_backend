const mongoose = require("mongoose");

const reportRequestSchema = new mongoose.Schema({
  // requestId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  submittedBy: {
    type: String,
    required: true,
  },
  department: { type: String, required: true },
  conversationHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatLog", // Reference to the ChatLog model
  },
  reportType: { type: String, required: true },
  visualization: {
    type: String,
    required: true
  },
  timeRange:{ type: String, required: true },
  summary: { type: String },
  comments: { type: [String], default: [] },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "Accepted","not sent","resubmit","rejected"],
    default: "not sent",
  },
});

const ReportRequest = mongoose.model("ReportRequest", reportRequestSchema);
module.exports = ReportRequest;
