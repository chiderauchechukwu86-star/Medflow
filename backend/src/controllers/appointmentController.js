const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");
const { getOrCreatePatientProfile } = require("../utils/patientProfile");

// @route POST /api/appointments
const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, date, startTime, endTime, reason } = req.body;
  let patientId = req.body.patient;

  if (!doctor || !date || !startTime) {
    return res.status(400).json({ message: "doctor, date, and startTime are required" });
  }

  // BUG FOUND: nothing previously verified `doctor` referred to a real
  // Doctor document — an invalid or stale id would silently create an
  // appointment with a dangling reference, which then shows up as a blank
  // "Dr. undefined" once populated. Reject it up front instead.
  const doctorExists = await Doctor.exists({ _id: doctor });
  if (!doctorExists) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  // If a patient is booking for themselves, resolve (or self-heal) their
  // Patient profile rather than hard-failing with "not found" — see
  // utils/patientProfile.js for why an account can reach here without one.
  if (req.user.role === "patient") {
    const patientProfile = await getOrCreatePatientProfile(req.user);
    patientId = patientProfile._id;
  }

  if (!patientId) return res.status(400).json({ message: "Patient is required" });

  // Prevent double-booking the same doctor at the same date/time
  const conflict = await Appointment.findOne({
    doctor,
    date,
    startTime,
    status: { $in: ["pending", "confirmed"] },
  });
  if (conflict) {
    return res.status(409).json({ message: "This time slot is already booked for the selected doctor" });
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor,
    date,
    startTime,
    endTime,
    reason,
    createdBy: req.user._id,
  });

  res.status(201).json(appointment);
});

// @route GET /api/appointments
// @desc Filters results based on the requesting user's role
const getAppointments = asyncHandler(async (req, res) => {
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
  if (req.query.date) filter.date = new Date(req.query.date);

  const appointments = await Appointment.find(filter)
    .populate({ path: "patient", populate: { path: "user", select: "name email phone" } })
    .populate({ path: "doctor", populate: { path: "user", select: "name email phone" } })
    .sort({ date: 1, startTime: 1 });

  res.json(appointments);
});

// @route PUT /api/appointments/:id
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });

  // BUG FOUND: a doctor could previously update the status of ANY
  // appointment, not just their own — updateAppointment never checked that
  // the requesting doctor's profile matched appointment.doctor. Receptionist
  // and admin remain able to manage any appointment, which is correct for
  // their role.
  if (req.user.role === "doctor") {
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile || String(appointment.doctor) !== String(doctorProfile._id)) {
      return res.status(403).json({ message: "You can only update your own appointments" });
    }
  }

  const updatable = ["date", "startTime", "endTime", "reason", "status", "notes"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) appointment[field] = req.body[field];
  });

  await appointment.save();
  res.json(appointment);
});

module.exports = { createAppointment, getAppointments, updateAppointment };
