const express = require("express");
const { createPrescription, getPrescriptionsByPatient } = require("../controllers/prescriptionController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("doctor"), createPrescription);
router.get("/:patientId", authorize("doctor", "patient", "admin"), getPrescriptionsByPatient);

module.exports = router;
