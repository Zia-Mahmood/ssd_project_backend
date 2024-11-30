const mongoose = require("mongoose");
const ReportRequest = require("../models/ReportRequestSchema"); // Adjust path as needed
const ChatLog = require("../models/ChatLogSchema");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Create a new report request (Sushma submits through conversation tool)
const createReportRequest = async (req, res) => {
  console.log(req.body);
  const {
    logName, userEmail, metaModelName
  } = req.body;

  try {
    const historyDoc = await ChatLog.findOne(
      { logName, userEmail, metaModelName },
      { chatHistory: 1 } // Only select chatHistory
    );

    // If no history is found
    if (!historyDoc) {
      return res.status(404).json({ message: "Chat history not found" });
    }

    const chatHistory = historyDoc.chatHistory;

    // Check if the summary message exists
    const summaryMessage = chatHistory
      .slice() // Create a shallow copy to avoid modifying the original array
      .reverse() // Start checking from the latest messages
      .find(
        (entry) =>
          entry.role === "model" &&
          entry.parts.some((part) =>
            part.text.includes(
              `The summary for Chat: ${logName} under ${metaModelName} department :`
            )
          )
      );

    if (summaryMessage) {
      // Extract the summary text
      const summaryText = summaryMessage.parts
        .find((part) =>
          part.text.includes(
            `The summary for Chat: ${logName} under ${metaModelName} department :`
          )
        )
        ?.text;

      // Check if a ReportRequest already exists for this conversationHistory (chatLogID)
      const existingReportRequest = await ReportRequest.findOne({
        conversationHistory: historyDoc._id,
      });

      if (existingReportRequest) {
        // Update the summary if the ReportRequest exists
        existingReportRequest.summary = summaryText; // Update the summary field
        existingReportRequest.status = "pending"; // Optionally update the status
        existingReportRequest.submittedAt = Date.now();
        await existingReportRequest.save(); // Save the updated document

        return res.status(200).json({
          message: "Report request updated successfully",
          reportRequest: existingReportRequest,
        });
      } else {// Log the summary message
        const history = historyDoc.chatHistory.map((entry) => ({
          role: entry.role,
          parts: entry.parts.map((part) => ({ text: part.text })), // Assuming `parts` is already an array of objects with `text`
        }));
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({ history: history });
        console.log("Chat started");
        let result = await chat.sendMessage(`I need a json response for this summary ${summaryMessage}, which should be of this format:{reportType:,VisualizationType:,TimeRange:} the spellings of reportType should be same as in meta model, visualizatioType should be one of these ["Bar Chart","Pie Chart","Line Graph","scatter Plot","Heatmap"] and TimeRange should be one of these ["Daily","Weekly","Monthly","Quarterly","Yearly"]. Just mention the data under brackets any other characters outside brackets are not required. If multiple values are present for these fields then print any one only.`);
        const responseText = result.response.text();

        // Clean up and parse the response
        const cleanedResponse = responseText.replace(/```json|```/g, ""); // Remove markdown artifacts
        const parsedResponse = JSON.parse(cleanedResponse); // Parse the JSON content

        // Extract the values
        const { reportType, VisualizationType, TimeRange } = parsedResponse;

        console.log("Extracted Data:");
        console.log("Report Type:", reportType);
        console.log("Visualization Type:", VisualizationType);
        console.log("Time Range:", TimeRange);

        // Create a new ReportRequest object
        const newReportRequest = new ReportRequest({
          submittedBy: userEmail,
          department: metaModelName,
          conversationHistory: historyDoc._id, // Reference to the ChatLog object ID
          reportType,
          visualization: VisualizationType,
          timeRange: TimeRange,
          summary: summaryMessage.parts
            .find((part) =>
              part.text.includes(
                `The summary for Chat: ${logName} under ${metaModelName} department :`
              )
            )
            ?.text, // Extract the actual summary text
          comments: [], // Empty array for comments
          status: "pending", // Initial status as "pending"
          submittedAt: Date.now(), // Current timestamp
        });

        // Save the report request to the database
        await newReportRequest.save();

        res.status(201).json({
          message: "Report request created successfully",
          reportRequest: newReportRequest,
        });
      }
    } else {
      // Respond if no summary is found
      return res.status(404).json({ message: "Summary not yet generated" });
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  // const {
  //   submittedBy,
  //   department,
  //   conversationHistory, // Ensure this is a single ChatLog ID
  //   reportType,
  //   visualization,
  //   filters,
  //   subReports,
  //   summary,
  // } = req.body;

  // try {
  //   // Ensure conversationHistory is a valid ObjectId
  //   if (!mongoose.Types.ObjectId.isValid(conversationHistory)) {
  //     return res
  //       .status(400)
  //       .json({ error: "Invalid conversation history ID." });
  //   }

  //   const newReport = new ReportRequest({
  //     submittedBy,
  //     department,
  //     conversationHistory,
  //     reportType,
  //     visualization,
  //     filters,
  //     subReports,
  //     summary,
  //   });

  //   await newReport.save();
  //   res.status(201).json({
  //     message: "Report request submitted successfully!",
  //     report: newReport,
  //   });
  // } catch (error) {
  //   res.status(400).json({ error: error.message });
  // }
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

// Controller function to handle accepting a report
const acceptReportRequest = async (req, res) => {
  const { reportId } = req.params;
  console.log(reportId);
  try {
    const report = await ReportRequest.findByIdAndUpdate(
      reportId,
      { status: "Accepted" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Controller function to handle rejecting a report
const rejectReportRequest = async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await ReportRequest.findByIdAndUpdate(
      reportId,
      { status: "Rejected" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controller function to handle sending a reply
const sendReply = async (req, res) => {
  const { reportId } = req.params;
  const { comment } = req.body; // comment sent by the user

  try {
    const report = await ReportRequest.findByIdAndUpdate(
      reportId,
      {
        status: "resubmit",
        $push: { comments: comment }, // Add the comment to the array
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Get all report requests (for Priyamwada to view)
const getAllReports = async (req, res) => {
  try {
    // Fetch all reports from the database
    const reports = await ReportRequest.find()
      .populate("conversationHistory", "logName metaModelName userEmail") // Populate related ChatLog fields if needed
      .sort({ submittedAt: -1 }); // Sort by most recently submitted

    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }

    // Return all reports
    res.status(200).json({
      message: "Reports fetched successfully",
      reports,
    });
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
  acceptReportRequest,
  rejectReportRequest,
  sendReply
};
