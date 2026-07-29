const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "17:00"
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, required: true, trim: true },
    licenseNumber: { type: String, trim: true },
    department: { type: String, trim: true },
    hospital: { type: String, trim: true },
    yearsOfExperience: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    availability: [availabilitySlotSchema],
    bio: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
