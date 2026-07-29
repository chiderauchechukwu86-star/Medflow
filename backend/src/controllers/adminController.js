const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const asyncHandler = require("../middleware/asyncHandler");
const { VALID_ROLES } = require("../config/roles");

// @route GET /api/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [totalPatients, totalDoctors, appointmentsToday, bills] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments(),
    Appointment.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay } }),
    Bill.find({ status: "paid" }),
  ]);

  const revenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

  res.json({
    totalPatients,
    totalDoctors,
    appointmentsToday,
    revenue,
  });
});

// @route GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  // IMPORTANT: this must go through toSafeObject() like every other user-facing
  // endpoint. Using .select("-password") alone (the previous implementation)
  // only removes the password field — it does NOT whitelist fields or
  // normalize a legacy/invalid role, so a stale document would leak straight
  // to the admin's User Management screen exactly like it did on login.
  const users = await User.find();
  res.json(users.map((u) => u.toSafeObject()));
});

// @route PUT /api/admin/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.role !== undefined && !VALID_ROLES.includes(req.body.role)) {
    return res.status(400).json({ message: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` });
  }

  const updatable = ["name", "role", "isActive", "phone"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  await user.save();
  res.json(user.toSafeObject());
});

module.exports = { getDashboardStats, getUsers, updateUser };
