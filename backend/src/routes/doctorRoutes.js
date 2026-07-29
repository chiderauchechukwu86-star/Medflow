const express = require("express");
const { getDoctors, getDoctorById, createDoctor, updateDoctor } = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getDoctors); // public-ish: patients need to browse doctors to book
router.get("/:id", getDoctorById);

router.use(protect);
router.post("/", authorize("admin"), createDoctor);
router.put("/:id", authorize("doctor", "admin"), updateDoctor);

module.exports = router;
