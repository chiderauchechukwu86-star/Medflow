const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, trim: true },
    frequency: { type: String, trim: true },
    duration: { type: String, trim: true },
    instructions: { type: String, trim: true },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    medicalRecord: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
    medications: [medicationSchema],
    notes: { type: String, trim: true },
    issuedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
