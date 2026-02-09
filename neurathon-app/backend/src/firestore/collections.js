export const COLLECTIONS = {
  ORGANIZATIONS: "organizations",
  GRANTS: "grants",
  USERS: "users",
  APPLICATIONS: "applications",
  PITCH_SESSIONS: "pitch_sessions",
  CREDITS: "credits",
  PITCH_ATTEMPT_COUNTERS: "pitch_attempt_counters",
};

export const USER_ROLES = new Set(["researcher", "startup"]);
export const APPLICATION_STATUSES = new Set([
  "applied",
  "reviewed",
  "accepted",
  "rejected",
]);
export const GENDER_VALUES = new Set(["male", "female", "other", "any"]);

export function buildUserGrantKey(userId, grantId) {
  return `${userId}_${grantId}`;
}

export function buildPitchSessionId(userId, grantId, attemptNumber) {
  return `${userId}_${grantId}_${attemptNumber}`;
}
