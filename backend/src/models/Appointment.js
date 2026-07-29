const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String }, // "10:30"
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rescheduled", "no_show"],
      default: "pending",
    },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, startTime: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
