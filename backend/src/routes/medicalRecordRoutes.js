const express = require("express");
const { createMedicalRecord, getMedicalRecordsByPatient } = require("../controllers/medicalRecordController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("doctor"), createMedicalRecord);
router.get("/:patientId", authorize("doctor", "nurse", "admin", "patient"), getMedicalRecordsByPatient);

module.exports = router;
