import type { Role } from "@/types";

// Mirrors backend/src/config/roles.js. Keep these two lists in sync — this
// is intentionally the ONE other place a role list is allowed to exist,
// because the frontend can receive a user object from sources the backend
// fix doesn't cover (e.g. a stale value cached in localStorage from before
// this fix shipped, or a future endpoint that forgets to use toSafeObject()).
export const VALID_ROLES: Role[] = ["patient", "doctor", "nurse", "receptionist", "lab_technician", "admin"];
export const DEFAULT_ROLE: Role = "patient";

const ROLE_ALIASES: Record<string, Role> = {
  user: "patient",
  patient_user: "patient",
  Patient: "patient",
  Doctor: "doctor",
  Admin: "admin",
  administrator: "admin",
};

/**
 * Coerces any role value the app receives (API response, localStorage cache,
 * etc.) into one of VALID_ROLES. Never returns anything else — every place
 * that reads user.role can trust it unconditionally after this runs.
 */
export function normalizeRole(role: unknown): Role {
  if (typeof role === "string" && (VALID_ROLES as string[]).includes(role)) {
    return role as Role;
  }
  if (typeof role === "string" && ROLE_ALIASES[role]) {
    return ROLE_ALIASES[role];
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[MedFlow] Unrecognized role "${String(role)}" — falling back to "${DEFAULT_ROLE}".`);
  }
  return DEFAULT_ROLE;
}

/**
 * Best-effort display name. Backend now always sends `name`, but this stays
 * defensive in case an older cached user object (or a future endpoint bug)
 * sends firstName/lastName instead.
 */
export function getDisplayName(user: { name?: string; firstName?: string; lastName?: string; email?: string } | null | undefined): string {
  if (!user) return "there";
  if (user.name && user.name.trim()) return user.name;
  const combined = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  if (user.email) return user.email.split("@")[0];
  return "there";
}
