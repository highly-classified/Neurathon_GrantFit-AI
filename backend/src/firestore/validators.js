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

export function normalizeGrantInput(input) {
  assert(input && typeof input === "object", "grant input is required");
  assert(input.eligibility && typeof input.eligibility === "object", "eligibility is required");

  const startDate = ensureTimestampInput(input.start_date, "start_date");
  const endDate = ensureTimestampInput(input.end_date, "end_date");
  const deadline = ensureTimestampInput(input.deadline, "deadline");

  const maxAmount = ensureFiniteNumber(input.max_amount, "max_amount");
  assert(maxAmount >= 0, "max_amount must be greater than or equal to 0");

  const minAge = ensureFiniteNumber(input.eligibility.min_age, "eligibility.min_age");
  assert(minAge >= 0, "eligibility.min_age must be greater than or equal to 0");

  return {
    organization_id: normalizeRequiredString(input.organization_id, "organization_id"),
    org_name: normalizeRequiredString(input.org_name, "org_name"),
    start_date: startDate,
    end_date: endDate,
    max_amount: maxAmount,
    domain: normalizeStringArray(input.domain, "domain"),
    eligibility: {
      min_age: minAge,
      citizenship: normalizeStringArray(
        input.eligibility.citizenship,
        "eligibility.citizenship"
      ),
      gender: normalizeGender(input.eligibility.gender, "eligibility.gender"),
      role: normalizeStringArray(input.eligibility.role, "eligibility.role"),
    },
    deadline,
    location: normalizeRequiredString(input.location, "location"),
    verified:
      input.verified === undefined
        ? false
        : ensureBoolean(input.verified, "verified"),
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
