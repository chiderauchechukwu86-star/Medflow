const LabTest = require("../models/LabTest");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");
const { getOrCreatePatientProfile } = require("../utils/patientProfile");

// @route POST /api/lab-tests
// @access doctor
const createLabTest = asyncHandler(async (req, res) => {
  const doctorProfile = await Doctor.findOne({ user: req.user._id });
  if (!doctorProfile) return res.status(400).json({ message: "Doctor profile not found" });

  const labTest = await LabTest.create({
    ...req.body,
    doctor: doctorProfile._id,
  });

  res.status(201).json(labTest);
});

// @route GET /api/lab-tests
// @desc Filters based on role: patient sees own, lab_technician/doctor/admin see relevant/all
const getLabTests = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "patient") {
    const patientProfile = await getOrCreatePatientProfile(req.user);
    filter.patient = patientProfile._id;
  } else if (req.user.role === "doctor") {
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) return res.json([]);
    filter.doctor = doctorProfile._id;
  }

  if (req.query.status) filter.status = req.query.status;

  const labTests = await LabTest.find(filter)
    .populate({ path: "patient", populate: { path: "user", select: "name" } })
    .populate({ path: "doctor", populate: { path: "user", select: "name" } })
    .sort({ requestedDate: -1 });

  res.json(labTests);
});

// @route PUT /api/lab-tests/:id
// @access lab_technician, admin
const updateLabTest = asyncHandler(async (req, res) => {
  const labTest = await LabTest.findById(req.params.id);
  if (!labTest) return res.status(404).json({ message: "Lab test not found" });

  const updatable = ["status", "results", "resultFileNote", "completedDate"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) labTest[field] = req.body[field];
  });
  labTest.processedBy = req.user._id;

  await labTest.save();
  res.json(labTest);
});

module.exports = { createLabTest, getLabTests, updateLabTest };
