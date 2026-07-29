const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    testName: { type: String, required: true, trim: true },
    testType: { type: String, trim: true },
    status: {
      type: String,
      enum: ["requested", "sample_collected", "in_progress", "completed", "cancelled"],
      default: "requested",
    },
    requestedDate: { type: Date, default: Date.now },
    completedDate: { type: Date },
    results: { type: String, trim: true },
    resultFileNote: { type: String, trim: true }, // placeholder, no file storage in MVP
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabTest", labTestSchema);
