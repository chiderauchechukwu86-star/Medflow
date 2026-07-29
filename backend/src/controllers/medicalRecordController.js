const MedicalRecord = require("../models/MedicalRecord");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");
const { getOrCreatePatientProfile } = require("../utils/patientProfile");

// @route POST /api/medical-records
// @access doctor
const createMedicalRecord = asyncHandler(async (req, res) => {
  const doctorProfile = await Doctor.findOne({ user: req.user._id });
  if (!doctorProfile) return res.status(400).json({ message: "Doctor profile not found" });

  const record = await MedicalRecord.create({
    ...req.body,
    doctor: doctorProfile._id,
  });

  res.status(201).json(record);
});

// @route GET /api/medical-records/:patientId
const getMedicalRecordsByPatient = asyncHandler(async (req, res) => {
  if (req.user.role === "patient") {
    const patientProfile = await getOrCreatePatientProfile(req.user);
    if (String(patientProfile._id) !== req.params.patientId) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const records = await MedicalRecord.find({ patient: req.params.patientId })
    .populate({ path: "doctor", populate: { path: "user", select: "name" } })
    .sort({ visitDate: -1 });

  res.json(records);
});

module.exports = { createMedicalRecord, getMedicalRecordsByPatient };
