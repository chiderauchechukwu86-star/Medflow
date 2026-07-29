const Prescription = require("../models/Prescription");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");
const { getOrCreatePatientProfile } = require("../utils/patientProfile");

// @route POST /api/prescriptions
// @access doctor
const createPrescription = asyncHandler(async (req, res) => {
  const doctorProfile = await Doctor.findOne({ user: req.user._id });
  if (!doctorProfile) return res.status(400).json({ message: "Doctor profile not found" });

  const prescription = await Prescription.create({
    ...req.body,
    doctor: doctorProfile._id,
  });

  res.status(201).json(prescription);
});

// @route GET /api/prescriptions/:patientId
const getPrescriptionsByPatient = asyncHandler(async (req, res) => {
  if (req.user.role === "patient") {
    const patientProfile = await getOrCreatePatientProfile(req.user);
    if (String(patientProfile._id) !== req.params.patientId) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const prescriptions = await Prescription.find({ patient: req.params.patientId })
    .populate({ path: "doctor", populate: { path: "user", select: "name" } })
    .sort({ issuedDate: -1 });

  res.json(prescriptions);
});

module.exports = { createPrescription, getPrescriptionsByPatient };
