const express = require("express");
const { createLabTest, getLabTests, updateLabTest } = require("../controllers/labTestController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("doctor"), createLabTest);
router.get("/", getLabTests); // filtered by role in controller
router.put("/:id", authorize("lab_technician", "admin"), updateLabTest);

module.exports = router;
