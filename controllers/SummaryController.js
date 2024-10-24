const Summary = require("./models/Summary"); // Adjust the path as needed

// Get all summaries submitted to a specific user
const getSummariesSubmittedToUser = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the request parameters

  try {
    const summaries = await Summary.find({ submittedTo: userId }).populate(
      "requestId submittedTo"
    );

    if (summaries.length === 0) {
      return res
        .status(404)
        .json({ message: "No summaries found for this user" });
    }

    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSummariesSubmittedToUser,
};
