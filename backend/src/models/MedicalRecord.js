const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    diagnosis: { type: String, trim: true },
    symptoms: [{ type: String, trim: true }],
    treatment: { type: String, trim: true },
    vitals: {
      temperature: Number,
      bloodPressure: String,
      heartRate: Number,
      respiratoryRate: Number,
      weight: Number,
      height: Number,
    },
    visitDate: { type: Date, default: Date.now },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
