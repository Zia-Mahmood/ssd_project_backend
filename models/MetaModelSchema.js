const mongoose = require("mongoose");

const metaModelSchema = new mongoose.Schema({
  modelId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  modelName: { type: String, required: true },
  modelData: { type: mongoose.Schema.Types.Mixed, required: true }, // JSON/XML
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MetaModel = mongoose.model("MetaModel", metaModelSchema);
module.exports = MetaModel;
