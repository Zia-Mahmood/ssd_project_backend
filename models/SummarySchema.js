const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  summaryId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReportRequest",
    required: true,
  },
  summaryText: { type: String, required: true },
  submittedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Summary = mongoose.model("Summary", summarySchema);
module.exports = Summary;
