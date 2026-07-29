const Doctor = require("../models/Doctor");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @route GET /api/doctors
const getDoctors = asyncHandler(async (req, res) => {
  const { specialization } = req.query;
  const filter = specialization ? { specialization: new RegExp(specialization, "i") } : {};
  const doctors = await Doctor.find(filter).populate("user", "name email phone isActive");
  res.json(doctors);
});

// @route GET /api/doctors/:id
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate("user", "name email phone isActive");
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

// @route POST /api/doctors
// @desc Admin creates a doctor account (creates User + Doctor profile)
const createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, specialization, licenseNumber, department, yearsOfExperience, consultationFee, availability, bio } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password: password || "changeme123", role: "doctor", phone });
  const doctor = await Doctor.create({
    user: user._id,
    specialization,
    licenseNumber,
    department,
    yearsOfExperience,
    consultationFee,
    availability,
    bio,
  });

  user.profileRef = doctor._id;
  user.profileModel = "Doctor";
  await user.save();

  res.status(201).json(doctor);
});

// @route PUT /api/doctors/:id
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  if (req.user.role === "doctor" && String(doctor.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const updatable = ["specialization", "department", "yearsOfExperience", "consultationFee", "availability", "bio"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) doctor[field] = req.body[field];
  });

  await doctor.save();
  res.json(doctor);
});

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor };
