const mongoose = require("mongoose");

const reportRequestSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    enum: ["bar", "pie", "line"],
    default: "bar",
  },
  filters: { type: mongoose.Schema.Types.Mixed },
  subReports: { type: [String], default: [] },
  summary: { type: String },
  comments: { type: [String], default: [] },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "processed","not sent","resubmit"],
    default: "not sent",
  },
});

const ReportRequest = mongoose.model("ReportRequest", reportRequestSchema);
module.exports = ReportRequest;
