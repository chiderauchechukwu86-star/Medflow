const Patient = require("../models/Patient");

/**
 * Resolves the Patient profile document for a given user, creating one on
 * the fly if it's missing. Under normal registration (authController) a
 * Patient document is always created alongside the User — but an account
 * repaired by migrateLegacyUsers.js (or provisioned any other way outside
 * that flow) can end up with role: "patient" and no linked Patient document.
 * Rather than hard-fail every downstream feature (booking, records, labs,
 * bills) for that account, self-heal it here the first time it's needed.
 */
async function getOrCreatePatientProfile(user) {
  let patient = await Patient.findOne({ user: user._id });

  if (!patient) {
    patient = await Patient.create({ user: user._id });
    user.profileRef = patient._id;
    user.profileModel = "Patient";
    await user.save();
  }

  return patient;
}

module.exports = { getOrCreatePatientProfile };
