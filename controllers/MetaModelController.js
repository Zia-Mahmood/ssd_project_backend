const MetaModel = require("./models/MetaModel"); // Adjust path as needed
const fs = require("fs");

// Get a specific meta model by department name
const getMetaModelByDepartment = async (req, res) => {
  try {
    const metaModel = await MetaModel.findOne({
      modelName: req.params.department,
    }).populate("uploadedBy");
    if (!metaModel) {
      return res.status(404).json({ message: "Meta model not found" });
    }
    res.status(200).json(metaModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update model data directly by department name
const updateMetaModelByDepartment = async (req, res) => {
  const { modelData } = req.body;

  try {
    const metaModel = await MetaModel.findOne({
      modelName: req.params.department,
    });
    if (!metaModel) {
      return res.status(404).json({ message: "Meta model not found" });
    }

    if (modelData) metaModel.modelData = modelData; // Update model data

    metaModel.updatedAt = Date.now(); // Update the timestamp
    await metaModel.save();

    res
      .status(200)
      .json({ message: "Meta model updated successfully", metaModel });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Upload a file to update model data by department name
const uploadMetaModelFile = async (req, res) => {
  const { department } = req.params;

  try {
    const metaModel = await MetaModel.findOne({ modelName: department });
    if (!metaModel) {
      return res.status(404).json({ message: "Meta model not found" });
    }

    // Read the file content
    const fileContent = fs.readFileSync(req.file.path, "utf-8");

    // Update model data with file content
    metaModel.modelData = fileContent; // Assuming file content is in a suitable format
    metaModel.updatedAt = Date.now(); // Update the timestamp

    await metaModel.save();

    // Optionally, delete the temporary file after use
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Meta model updated successfully from file",
      metaModel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMetaModelByDepartment,
  updateMetaModelByDepartment,
  uploadMetaModelFile,
};
