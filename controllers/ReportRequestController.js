const mongoose = require("mongoose");
const ReportRequest = require("./models/ReportRequestSchema"); // Adjust path as needed

// Create a new report request (Sushma submits through conversation tool)
const createReportRequest = async (req, res) => {
  const {
    submittedBy,
    department,
    conversationHistory, // Ensure this is a single ChatLog ID
    reportType,
    visualization,
    filters,
    subReports,
    summary,
  } = req.body;

  try {
    // Ensure conversationHistory is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(conversationHistory)) {
      return res
        .status(400)
        .json({ error: "Invalid conversation history ID." });
    }

    const newReport = new ReportRequest({
      submittedBy,
      department,
      conversationHistory,
      reportType,
      visualization,
      filters,
      subReports,
      summary,
    });

    await newReport.save();
    res.status(201).json({
      message: "Report request submitted successfully!",
      report: newReport,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get reports filtered by region, visualization, report type or by searching the summary
const getFilteredReports = async (req, res) => {
  const { region, visualization, reportType, summaryText } = req.query;

  const filter = {};
  if (region) filter["filters.region"] = region;
  if (visualization) filter.visualization = visualization;
  if (reportType) filter.reportType = reportType;

  try {
    let reports;

    if (summaryText) {
      const regex = new RegExp(summaryText, "i");
      reports = await ReportRequest.find({
        ...filter,
        summary: { $regex: regex },
      }).populate("submittedBy");
    } else {
      reports = await ReportRequest.find(filter).populate("submittedBy");
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all report requests (for Priyamwada to view)
const getAllReports = async (req, res) => {
  const { status } = req.query;

  try {
    const filter = status ? { status } : {};
    const reports = await ReportRequest.find(filter).populate("submittedBy");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific report request by ID (for detailed review by Priyamwada)
const getReportById = async (req, res) => {
  try {
    const report = await ReportRequest.findById(req.params.id).populate(
      "submittedBy"
    );
    if (!report) {
      return res.status(404).json({ message: "Report request not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the status or add comments to a report (for Priyamwada)
const updateReport = async (req, res) => {
  const { status, comments } = req.body;

  try {
    const report = await ReportRequest.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report request not found" });
    }

    // Update status and/or append new comments
    if (status) report.status = status;
    if (comments) report.comments.push(comments);

    await report.save();
    res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reports submitted by a specific user (e.g., Sushma’s reports)
const getReportsByUserId = async (req, res) => {
  try {
    const reports = await ReportRequest.find({
      submittedBy: req.params.userId,
    }).populate("submittedBy");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReportRequest,
  getFilteredReports,
  getAllReports,
  getReportById,
  updateReport,
  getReportsByUserId,
};
