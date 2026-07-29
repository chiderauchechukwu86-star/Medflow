const express = require("express");
const { createBill, getBills, updateBill } = require("../controllers/billController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("receptionist", "admin"), createBill);
router.get("/", getBills); // filtered by role in controller
router.put("/:id", authorize("receptionist", "admin"), updateBill);

module.exports = router;
