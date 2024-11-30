const express = require("express");
//const multer = require("multer");
const {
  getMetaModelByDepartment,
  updateMetaModelByDepartment,
  uploadMetaModelFile,
} = require("../controllers/MetaModelController");

const router = express.Router();

// Configure multer for file uploads
//const upload = multer({ dest: "uploads/" });

// Get a specific meta model by department name
router.get("/metaModel/:department", getMetaModelByDepartment);

// Update model data directly by department name
router.put("/metaModel/:department", updateMetaModelByDepartment);

// Upload a file to update model data by department name
//router.post("/:department/upload", upload.single("file"), uploadMetaModelFile);

module.exports = router;
