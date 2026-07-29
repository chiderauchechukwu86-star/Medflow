// Seeds the database with a demo admin, one doctor, and one patient so you
// can log in right away.
// Run with: npm run seed
//
// Safe to re-run: only touches the three specific demo emails below, not
// every Doctor/Patient document in your database (an earlier version of
// this script used deleteMany({}) with no filter, which would have wiped
// every real patient/doctor profile on a shared/production database —
// fixed here to only ever remove what this script itself created).

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const DEMO_EMAILS = ["admin@medflow.dev", "chiderauchechukwu86@gmail.com", "patient@medflow.dev"];

const seed = async () => {
  await connectDB();

  console.log("Clearing previous demo accounts (only these three emails)...");
  const existing = await User.find({ email: { $in: DEMO_EMAILS } });
  const existingIds = existing.map((u) => u._id);
  await Doctor.deleteMany({ user: { $in: existingIds } });
  await Patient.deleteMany({ user: { $in: existingIds } });
  await User.deleteMany({ email: { $in: DEMO_EMAILS } });

  const admin = await User.create({
    name: "Ada Admin",
    email: "admin@medflow.dev",
    password: "password123",
    role: "admin",
  });

  const doctorUser = await User.create({
    name: "Dr. Chidera Uchechukwu",
    email: "chiderauchechukwu86@gmail.com",
    password: "password123",
    role: "doctor",
  });
  const doctorProfile = await Doctor.create({
    user: doctorUser._id,
    specialization: "Internal Medicine",
    department: "Outpatient",
    hospital: "MedFlow General Hospital",
    yearsOfExperience: 8,
    consultationFee: 5000,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "16:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "16:00" },
    ],
  });
  doctorUser.profileRef = doctorProfile._id;
  doctorUser.profileModel = "Doctor";
  await doctorUser.save();

  const patientUser = await User.create({
    name: "Peter Patient",
    email: "patient@medflow.dev",
    password: "password123",
    role: "patient",
  });
  const patientProfile = await Patient.create({
    user: patientUser._id,
    gender: "male",
    bloodGroup: "O+",
  });
  patientUser.profileRef = patientProfile._id;
  patientUser.profileModel = "Patient";
  await patientUser.save();

  console.log("\nSeed complete. Demo accounts (password: password123):");
  console.log("  admin@medflow.dev            (admin)");
  console.log("  chiderauchechukwu86@gmail.com (doctor — Dr. Chidera Uchechukwu, Internal Medicine)");
  console.log("  patient@medflow.dev           (patient)");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
