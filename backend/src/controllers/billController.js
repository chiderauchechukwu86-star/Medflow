const Bill = require("../models/Bill");
const asyncHandler = require("../middleware/asyncHandler");
const { getOrCreatePatientProfile } = require("../utils/patientProfile");

// @route POST /api/bills
// @access receptionist, admin
const createBill = asyncHandler(async (req, res) => {
  const { patient, appointment, items, paymentMethod } = req.body;
  const totalAmount = (items || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const bill = await Bill.create({
    patient,
    appointment,
    items,
    totalAmount,
    paymentMethod,
  });

  res.status(201).json(bill);
});

// @route GET /api/bills
const getBills = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "patient") {
    const patientProfile = await getOrCreatePatientProfile(req.user);
    filter.patient = patientProfile._id;
  }

  if (req.query.status) filter.status = req.query.status;

  const bills = await Bill.find(filter)
    .populate({ path: "patient", populate: { path: "user", select: "name email" } })
    .sort({ issuedDate: -1 });

  res.json(bills);
});

// @route PUT /api/bills/:id
// @access receptionist, admin
const updateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) return res.status(404).json({ message: "Bill not found" });

  const { amountPaid, paymentMethod, status } = req.body;
  if (amountPaid !== undefined) bill.amountPaid = amountPaid;
  if (paymentMethod !== undefined) bill.paymentMethod = paymentMethod;
  if (status !== undefined) bill.status = status;
  if (bill.amountPaid >= bill.totalAmount) bill.paidDate = new Date();

  await bill.save();
  res.json(bill);
});

module.exports = { createBill, getBills, updateBill };
