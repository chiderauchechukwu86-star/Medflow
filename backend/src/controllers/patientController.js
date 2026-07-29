const Patient = require("../models/Patient");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { getOrCreatePatientProfile } = require("../utils/patientProfile");

// @route GET /api/patients
// @access doctor, nurse, receptionist, admin
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find().populate("user", "name email phone isActive");
  res.json(patients);
});

// @route GET /api/patients/:id
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate("user", "name email phone isActive");
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  // Patients may only view their own record
  if (req.user.role === "patient" && String(patient.user._id) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(patient);
});

// @route POST /api/patients
// @desc Receptionist/Admin registers a new patient (creates User + Patient)
const createPatient = asyncHandler(async (req, res) => {
  const { name, email, password, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password: password || "changeme123", role: "patient", phone });
  const patient = await Patient.create({
    user: user._id,
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    emergencyContact,
  });

  user.profileRef = patient._id;
  user.profileModel = "Patient";
  await user.save();

  res.status(201).json(patient);
});

// @route PUT /api/patients/:id
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  if (req.user.role === "patient" && String(patient.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const updatable = ["dateOfBirth", "gender", "bloodGroup", "address", "allergies", "chronicConditions", "emergencyContact"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) patient[field] = req.body[field];
  });

  await patient.save();
  res.json(patient);
});

// @route GET /api/patients/me/profile
// @desc  Lets a logged-in patient fetch their own Patient profile id/details
const getMyProfile = asyncHandler(async (req, res) => {
  const patient = await getOrCreatePatientProfile(req.user);
  await patient.populate("user", "name email phone isActive");
  res.json(patient);
});

module.exports = { getPatients, getPatientById, createPatient, updatePatient, getMyProfile };
