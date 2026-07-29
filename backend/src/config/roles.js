// Single source of truth for user roles. Import this everywhere a role is
// validated, defaulted, or displayed — never hardcode the role list again.

const VALID_ROLES = ["patient", "doctor", "nurse", "receptionist", "lab_technician", "admin"];
const DEFAULT_ROLE = "patient";

// Legacy/alias values we've seen in stale data, mapped to a valid role.
// Add entries here if you discover other historical role strings in your DB.
const ROLE_ALIASES = {
  user: "patient",
  patient_user: "patient",
  Patient: "patient",
  Doctor: "doctor",
  Admin: "admin",
  administrator: "admin",
};

/**
 * Coerces any incoming role value (from a stale DB document, a bad request
 * body, etc.) into one of VALID_ROLES. Never throws, never returns an
 * unrecognized value — callers can trust the result unconditionally.
 */
function normalizeRole(role) {
  if (VALID_ROLES.includes(role)) return role;
  if (role && ROLE_ALIASES[role]) return ROLE_ALIASES[role];
  return DEFAULT_ROLE;
}

module.exports = { VALID_ROLES, DEFAULT_ROLE, ROLE_ALIASES, normalizeRole };
