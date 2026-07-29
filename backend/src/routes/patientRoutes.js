const express = require("express");
const { getPatients, getPatientById, createPatient, updatePatient, getMyProfile } = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", authorize("doctor", "nurse", "receptionist", "admin"), getPatients);
router.post("/", authorize("receptionist", "admin"), createPatient);
router.get("/me/profile", getMyProfile);
router.get("/:id", getPatientById); // access check handled in controller
router.put("/:id", updatePatient); // access check handled in controller

module.exports = router;
