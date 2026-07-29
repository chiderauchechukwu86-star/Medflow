const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");
const { DEFAULT_ROLE } = require("../config/roles");

const generateToken = (user) => {
  // role is included for convenience/debugging only (e.g. reading a decoded
  // token while developing). It is NOT trusted for authorization — protect()
  // always re-fetches the user from the DB and normalizes the role fresh on
  // every request, so a stale or tampered token claim can't grant access.
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Roles that may create their own account through this public endpoint.
// nurse/receptionist/lab_technician/admin are intentionally excluded — those
// still require an admin to create the account (see adminController /
// doctorController). Doctor self-registration is enabled here on request;
// see the note in register() below about the tradeoff that comes with it.
const SELF_REGISTERABLE_ROLES = ["patient", "doctor"];

// @route POST /api/auth/register
// @desc  Register a new user. Creates a linked Patient or Doctor profile
//        in the same request so the account is immediately usable —
//        no follow-up step is needed before a patient can book or a
//        doctor can be booked with.
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, ...roleDetails } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const finalRole = SELF_REGISTERABLE_ROLES.includes(role) ? role : DEFAULT_ROLE;

  // Doctor self-registration needs a specialization to be a usable doctor
  // profile — validate it up front with a clear message rather than letting
  // a confusing Mongoose ValidationError surface later.
  if (finalRole === "doctor" && !roleDetails.specialization) {
    return res.status(400).json({ message: "Specialization is required to register as a doctor" });
  }

  const user = await User.create({ name, email, password, role: finalRole, phone });

  if (finalRole === "patient") {
    const patient = await Patient.create({
      user: user._id,
      dateOfBirth: roleDetails.dateOfBirth,
      gender: roleDetails.gender,
      bloodGroup: roleDetails.bloodGroup,
    });
    user.profileRef = patient._id;
    user.profileModel = "Patient";
    await user.save();
  } else if (finalRole === "doctor") {
    // SECURITY TRADEOFF: allowing anyone to self-register as a doctor means
    // anyone can appear in the booking list and act on appointments/patient
    // data with no vetting. This is enabled here because it was explicitly
    // requested (useful for a demo/school project where creating a doctor
    // through the admin flow every time is friction you don't want). Before
    // any real deployment, gate this behind admin approval — e.g. create the
    // account with isActive: false and require an admin to activate it via
    // PUT /api/admin/users/:id, or drop doctor from SELF_REGISTERABLE_ROLES
    // entirely and go back to admin-only creation via POST /api/doctors.
    const doctor = await Doctor.create({
      user: user._id,
      specialization: roleDetails.specialization,
      hospital: roleDetails.hospital,
      department: roleDetails.department,
    });
    user.profileRef = doctor._id;
    user.profileModel = "Doctor";
    await user.save();
  }

  const token = generateToken(user);
  res.status(201).json({ token, user: user.toSafeObject() });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (!user.isActive) {
    return res.status(403).json({ message: "Account is deactivated" });
  }

  const token = generateToken(user);
  res.json({ token, user: user.toSafeObject() });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

module.exports = { register, login, getMe };
