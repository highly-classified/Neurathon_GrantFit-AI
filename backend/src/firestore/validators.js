import { Timestamp } from "firebase/firestore";
import { GENDER_VALUES } from "./collections.js";

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new ValidationError(message);
  }
}

export function ensureSignedInUser(auth) {
  const user = auth.currentUser;
  assert(user && user.uid, "AUTH_REQUIRED");
  return user;
}

export function normalizeRequiredString(value, fieldName) {
  assert(typeof value === "string", `${fieldName} must be a string`);
  const trimmed = value.trim();
  assert(trimmed.length > 0, `${fieldName} is required`);
  return trimmed;
}

export function normalizeLowercaseString(value, fieldName) {
  return normalizeRequiredString(value, fieldName).toLowerCase();
}

export function normalizeStringArray(value, fieldName) {
  assert(Array.isArray(value), `${fieldName} must be an array`);
  assert(value.length > 0, `${fieldName} must contain at least one value`);
  return value.map((entry, index) =>
    normalizeLowercaseString(entry, `${fieldName}[${index}]`)
  );
}

export function ensureFiniteNumber(value, fieldName) {
  assert(typeof value === "number" && Number.isFinite(value), `${fieldName} must be a valid number`);
  return value;
}

export function ensureBoolean(value, fieldName) {
  assert(typeof value === "boolean", `${fieldName} must be a boolean`);
  return value;
}

export function ensureTimestampInput(value, fieldName) {
  const isDate = value instanceof Date && !Number.isNaN(value.getTime());
  const isTimestamp = value instanceof Timestamp;
  assert(isDate || isTimestamp, `${fieldName} must be a Date or Firestore Timestamp`);
  return value;
}

export function ensureRange(value, fieldName, min, max) {
  ensureFiniteNumber(value, fieldName);
  assert(value >= min && value <= max, `${fieldName} must be between ${min} and ${max}`);
  return value;
}

export function normalizeGender(value, fieldName) {
  const normalized = normalizeLowercaseString(value, fieldName);
  assert(GENDER_VALUES.has(normalized), `${fieldName} must be one of: ${Array.from(GENDER_VALUES).join(", ")}`);
  return normalized;
}

export function normalizeUserInput(input) {
  assert(input && typeof input === "object", "user input is required");
  return {
    age: normalizeRequiredString(input.age, "age"),
    citizenship: normalizeRequiredString(input.citizenship, "citizenship"),
    displayName: normalizeRequiredString(input.displayName, "displayName"),
    domain: normalizeRequiredString(input.domain, "domain"),
    email: normalizeRequiredString(input.email, "email"),
    fundingRequirement: normalizeRequiredString(input.fundingRequirement, "fundingRequirement"),
    gender: normalizeRequiredString(input.gender, "gender"),
    role: normalizeRequiredString(input.role, "role"),
  };
}

export function normalizeOrganizerInput(input) {
  assert(input && typeof input === "object", "organizer input is required");

  return {
    domain: normalizeRequiredString(input.domain, "domain"),
    event_name: normalizeRequiredString(input.event_name, "event_name"),
    org_id: normalizeRequiredString(input.org_id, "org_id"),
    org_name: normalizeRequiredString(input.org_name, "org_name"),
    source: normalizeRequiredString(input.source, "source"),
    reg_start_date: normalizeRequiredString(input.reg_start_date, "reg_start_date"),
    reg_end_date: input.reg_end_date || null,
    eligibility_criteria: {
      career_stage: Array.isArray(input.eligibility_criteria?.career_stage) ? input.eligibility_criteria.career_stage : [],
      citizenship: Array.isArray(input.eligibility_criteria?.citizenship) ? input.eligibility_criteria.citizenship : [],
      confidence: normalizeRequiredString(input.eligibility_criteria?.confidence || "low", "eligibility_criteria.confidence"),
      source: normalizeRequiredString(input.eligibility_criteria?.source || "unknown", "eligibility_criteria.source"),
    },
    funding_profile: {
      basis: normalizeRequiredString(input.funding_profile?.basis || "estimated", "funding_profile.basis"),
      confidence: normalizeRequiredString(input.funding_profile?.confidence || "low", "funding_profile.confidence"),
      max_amt_estimated: ensureFiniteNumber(input.funding_profile?.max_amt_estimated || 0, "funding_profile.max_amt_estimated"),
      min_amt_estimated: ensureFiniteNumber(input.funding_profile?.min_amt_estimated || 0, "funding_profile.min_amt_estimated"),
      max_amt: ensureFiniteNumber(input.funding_profile?.max_amt || 0, "funding_profile.max_amt"),
    },
    org_active_window: {
      confidence: normalizeRequiredString(input.org_active_window?.confidence || "low", "org_active_window.confidence"),
      end: normalizeRequiredString(input.org_active_window?.end || "", "org_active_window.end"),
      source: normalizeRequiredString(input.org_active_window?.source || "unknown", "org_active_window.source"),
      start: normalizeRequiredString(input.org_active_window?.start || "", "org_active_window.start"),
    },
    prev_year_funded_projects: Array.isArray(input.prev_year_funded_projects) ? input.prev_year_funded_projects : [],
    tags: Array.isArray(input.tags) ? input.tags : [],
  };
}

export function normalizeApplicationInput(input) {
  assert(input && typeof input === "object", "application input is required");
  return {
    grant_id: normalizeRequiredString(input.grant_id, "grant_id"),
    organization_id: normalizeRequiredString(input.organization_id, "organization_id"),
    eligibility_score: ensureFiniteNumber(input.eligibility_score, "eligibility_score"),
  };
}

export function normalizePitchSessionInput(input) {
  assert(input && typeof input === "object", "pitch session input is required");
  return {
    grant_id: normalizeRequiredString(input.grant_id, "grant_id"),
    readiness_score: ensureRange(input.readiness_score, "readiness_score", 0, 100),
    feedback: normalizeRequiredString(input.feedback, "feedback"),
  };
}
