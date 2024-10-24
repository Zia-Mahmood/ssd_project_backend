const express = require("express");
const router = express.Router();
const {
  createReportRequest,
  getFilteredReports,
  getAllReports,
  getReportById,
  updateReport,
  getReportsByUserId,
} = require("../controllers/ReportRequestController");

// Create a new report request (Sushma submits through conversation tool)
router.post("/", createReportRequest);

// Get reports filtered by region, visualization, report type or by searching the summary
router.get("/filter", getFilteredReports);

// Get all report requests (for Priyamwada to view)
router.get("/", getAllReports);

// Get a specific report request by ID (for detailed review by Priyamwada)
router.get("/:id", getReportById);

// Update the status or add comments to a report (for Priyamwada)
router.put("/:id", updateReport);

// Get all reports submitted by a specific user (e.g., Sushma’s reports)
router.get("/user/:userId", getReportsByUserId);

module.exports = router;
