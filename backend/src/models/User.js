const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { VALID_ROLES, DEFAULT_ROLE, normalizeRole } = require("../config/roles");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: VALID_ROLES,
      default: DEFAULT_ROLE,
    },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    // Links to role-specific profile documents
    profileRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "profileModel",
    },
    profileModel: {
      type: String,
      enum: ["Patient", "Doctor"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();

  // Defensive fallback: if a legacy document has firstName/lastName instead
  // of name (from an older schema or a differently-shaped seed), derive a
  // display name rather than surfacing raw legacy fields to the client.
  const legacyFirst = obj.firstName;
  const legacyLast = obj.lastName;
  const name = obj.name || [legacyFirst, legacyLast].filter(Boolean).join(" ") || "Unnamed User";

  // Explicit whitelist: only fields our current schema/contract defines are
  // ever returned, regardless of what extra properties exist on the raw
  // underlying document. This is what actually stops legacy DB pollution
  // (e.g. firstName/lastName/role:"user" from a stale document) from ever
  // reaching the frontend again.
  return {
    _id: obj._id,
    name,
    email: obj.email,
    role: normalizeRole(obj.role),
    phone: obj.phone,
    isActive: obj.isActive,
    profileRef: obj.profileRef,
    profileModel: obj.profileModel,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

module.exports = mongoose.model("User", userSchema);
