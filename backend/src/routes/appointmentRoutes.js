const express = require("express");
const { createAppointment, getAppointments, updateAppointment } = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("patient", "receptionist", "admin"), createAppointment);
router.get("/", getAppointments); // filtered by role in controller
router.put("/:id", authorize("doctor", "receptionist", "admin"), updateAppointment);

module.exports = router;
