// One-time cleanup for documents already sitting in your `users` collection
// that predate the current schema (e.g. firstName/lastName instead of name,
// or role: "user" instead of one of the six canonical roles) — and for
// patient-role users that are missing their linked Patient profile document
// (e.g. an account repaired by an earlier run of this same script, before
// this step existed, which fixed `role` but didn't create a profile).
//
// The API-level fixes (User.toSafeObject() + getOrCreatePatientProfile())
// stop these from causing errors going forward, but the underlying data is
// still incomplete until this runs — this script repairs it in place.
//
// Run with: npm run migrate:legacy-users
// Safe to run multiple times (it's a no-op once everything is clean).

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { VALID_ROLES, DEFAULT_ROLE, normalizeRole } = require("../config/roles");
const User = require("../models/User");
const Patient = require("../models/Patient");

const migrateUserFields = async (users) => {
  const candidates = await users
    .find({
      $or: [
        { role: { $nin: VALID_ROLES } },
        { name: { $exists: false } },
        { name: "" },
        { name: null },
      ],
    })
    .toArray();

  if (candidates.length === 0) {
    console.log("Step 1/2 — user fields: nothing to repair.");
    return;
  }

  console.log(`Step 1/2 — user fields: repairing ${candidates.length} document(s):`);

  for (const doc of candidates) {
    const update = {};

    if (!VALID_ROLES.includes(doc.role)) {
      update.role = normalizeRole(doc.role);
    }

    if (!doc.name) {
      const derived = [doc.firstName, doc.lastName].filter(Boolean).join(" ").trim();
      update.name = derived || (doc.email ? doc.email.split("@")[0] : "Unnamed User");
    }

    if (Object.keys(update).length === 0) continue;

    console.log(`  ${doc.email || doc._id}: role "${doc.role}" -> "${update.role ?? doc.role}"` +
      (update.name ? `, name -> "${update.name}"` : ""));

    await users.updateOne(
      { _id: doc._id },
      {
        $set: update,
        // Remove the old fields now that `name` covers them — comment this
        // out if you want to keep them around for reference.
        $unset: { firstName: "", lastName: "" },
      }
    );
  }
};

const backfillMissingPatientProfiles = async () => {
  const patientUsers = await User.find({ role: "patient" });
  const missing = [];

  for (const user of patientUsers) {
    const existing = await Patient.findOne({ user: user._id });
    if (!existing) missing.push(user);
  }

  if (missing.length === 0) {
    console.log("Step 2/2 — patient profiles: nothing to backfill.");
    return;
  }

  console.log(`Step 2/2 — patient profiles: creating ${missing.length} missing profile(s):`);

  for (const user of missing) {
    const patient = await Patient.create({ user: user._id });
    user.profileRef = patient._id;
    user.profileModel = "Patient";
    await user.save();
    console.log(`  ${user.email}: created Patient profile ${patient._id}`);
  }
};

const migrate = async () => {
  await connectDB();
  const db = mongoose.connection.db;
  const users = db.collection("users");

  // Step 1 uses the raw driver (not the Mongoose model) so we see documents
  // exactly as they are in the DB, including fields the current schema
  // doesn't declare.
  await migrateUserFields(users);

  // Step 2 uses the Mongoose models directly since it needs schema defaults
  // and .save() to correctly create a new, valid Patient document.
  await backfillMissingPatientProfiles();

  console.log(`\nDone. Default role used where unmappable: "${DEFAULT_ROLE}".`);
  await mongoose.connection.close();
  process.exit(0);
};

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
