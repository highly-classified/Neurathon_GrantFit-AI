import {
  addDoc,
  collection,
  getDocs,
  limit as queryLimit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { COLLECTIONS } from "./collections.js";

const DEFAULT_MY_GRANTS_ENDPOINT = "https://api.mygrants.gov/v1/grants";

function coerceString(value, fallback = "") {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function coerceNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function coerceDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

function normalizeDomain(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => coerceString(item).toLowerCase())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[|,]/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function sanitizeForFirestore(value) {
  if (value === null) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined);
  }
  if (typeof value === "object") {
    const normalized = {};
    for (const [key, item] of Object.entries(value)) {
      const sanitized = sanitizeForFirestore(item);
      if (sanitized !== undefined) {
        normalized[key] = sanitized;
      }
    }
    return normalized;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  return undefined;
}

function normalizeEligibility(value) {
  if (value === undefined || value === null) {
    return {};
  }
  if (typeof value === "string") {
    return { description: value.trim() };
  }
  if (Array.isArray(value)) {
    return {
      items: value.map((item) => coerceString(item)).filter(Boolean),
    };
  }
  if (typeof value === "object") {
    return sanitizeForFirestore(value) || {};
  }
  return { value: coerceString(value) };
}

function extractGrantList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && Array.isArray(payload.grants)) {
    return payload.grants;
  }
  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }
  if (payload && payload.data) {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload.data.grants)) {
      return payload.data.grants;
    }
    if (Array.isArray(payload.data.results)) {
      return payload.data.results;
    }
  }
  return [];
}

function pickExternalId(grant) {
  return coerceString(
    grant.external_id ??
    grant.id ??
    grant.grant_id ??
    grant.opportunity_id ??
    grant.opportunityId
  );
}

export function normalizeExternalGrant(grant) {
  const externalId = pickExternalId(grant);
  if (!externalId) {
    throw new Error("Unable to normalize grant without external_id");
  }

  return {
    source: coerceString(grant.source, "grants.gov_api"),
    domain: coerceString(grant.domain ?? grant.domains ?? grant.category, "General"),
    event_name: coerceString(grant.title ?? grant.opportunity_title ?? grant.event_name, "Funding Opportunity"),
    org_id: coerceString(grant.organization_id ?? grant.org_id ?? grant.agency_id, "UNKNOWN"),
    org_name: coerceString(grant.org_name ?? grant.organization_name ?? grant.agency_name, "Unknown Organization"),
    reg_start_date: coerceString(grant.start_date ?? grant.open_date, "2024-01-01"),
    reg_end_date: grant.deadline ?? grant.close_date ?? null,
    eligibility_criteria: {
      career_stage: Array.isArray(grant.eligibility?.role) ? grant.eligibility.role : ["any"],
      citizenship: Array.isArray(grant.eligibility?.citizenship) ? grant.eligibility.citizenship : ["any"],
      confidence: "medium",
      source: "synthetic_enrichment",
    },
    funding_profile: {
      basis: "estimated",
      confidence: "medium",
      max_amt: coerceNumber(grant.max_amount ?? grant.award_ceiling, 0),
      max_amt_estimated: coerceNumber(grant.max_amount ?? grant.award_ceiling, 0),
      min_amt_estimated: 0,
    },
    org_active_window: {
      confidence: "medium",
      start: coerceString(grant.start_date ?? grant.open_date, "2024-01-01"),
      end: coerceString(grant.deadline ?? grant.close_date, "2026-12-31"),
      source: "synthetic_enrichment",
    },
    prev_year_funded_projects: [],
    tags: normalizeDomain(grant.domain ?? grant.category),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
}

export async function fetchMyGrantsGovGrants({
  endpoint = DEFAULT_MY_GRANTS_ENDPOINT,
  fetchImpl = globalThis.fetch,
  mockGrants,
} = {}) {
  if (Array.isArray(mockGrants)) {
    console.info(
      `[grantIngestion] using mock payload with ${mockGrants.length} grants`
    );
    return mockGrants;
  }

  if (typeof fetchImpl !== "function") {
    throw new Error("fetch is not available in this runtime");
  }

  const response = await fetchImpl(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `MyGrants.gov request failed (${response.status} ${response.statusText})`
    );
  }

  const payload = await response.json();
  const grants = extractGrantList(payload);
  console.info(`[grantIngestion] fetched ${grants.length} grants from MyGrants.gov`);
  return grants;
}

export async function upsertGrantByExternalId(grantInput) {
  const normalizedGrant = normalizeExternalGrant(grantInput);
  const grantsRef = collection(db, COLLECTIONS.ORGANIZERS);
  const existingQuery = query(
    grantsRef,
    where("external_id", "==", normalizedGrant.external_id),
    queryLimit(1)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    const existingRef = existingSnapshot.docs[0].ref;
    await setDoc(existingRef, normalizedGrant);
    console.info(
      `[grantIngestion] updated grant external_id=${normalizedGrant.external_id}`
    );
    return { grant_id: existingRef.id, action: "updated" };
  }

  const created = await addDoc(grantsRef, normalizedGrant);
  console.info(
    `[grantIngestion] inserted grant external_id=${normalizedGrant.external_id}`
  );
  return { grant_id: created.id, action: "inserted" };
}

export async function ingestMyGrantsGovGrants(options = {}) {
  const rawGrants = await fetchMyGrantsGovGrants(options);
  const dedupedByExternalId = new Map();
  let skipped = 0;

  for (const grant of rawGrants) {
    try {
      const normalized = normalizeExternalGrant(grant);
      dedupedByExternalId.set(normalized.external_id, normalized);
    } catch (error) {
      skipped += 1;
      console.warn(
        `[grantIngestion] skipped malformed grant: ${error.message}`
      );
    }
  }

  let inserted = 0;
  let updated = 0;

  for (const normalizedGrant of dedupedByExternalId.values()) {
    const result = await upsertGrantByExternalId(normalizedGrant);
    if (result.action === "updated") {
      updated += 1;
    } else {
      inserted += 1;
    }
  }

  const summary = {
    total_received: rawGrants.length,
    total_processed: dedupedByExternalId.size,
    skipped,
    inserted,
    updated,
  };
  console.info(
    `[grantIngestion] completed total_processed=${summary.total_processed} inserted=${inserted} updated=${updated}`
  );
  return summary;
}

export async function testGrantWrite() {
  const sampleGrant = normalizeExternalGrant({
    source: "mygrants.gov",
    external_id: `test-grant-${Date.now()}`,
    organization_id: "org-test-001",
    org_name: "Test Foundation",
    start_date: "2026-01-01",
    end_date: "2026-12-31",
    max_amount: 50000,
    domain: ["ai", "education"],
    eligibility: {
      min_age: 18,
      citizenship: ["us"],
      role: ["startup"],
    },
    deadline: "2026-10-01",
    verified: false,
  });

  const result = await upsertGrantByExternalId(sampleGrant);
  console.info(
    `[grantIngestion] testGrantWrite action=${result.action} external_id=${sampleGrant.external_id}`
  );
  return { ...result, external_id: sampleGrant.external_id };
}

export async function testGrantQuery({
  domain = "ai",
  deadline = "2100-01-01",
} = {}) {
  const normalizedDomain = coerceString(domain).toLowerCase();
  const deadlineDate = coerceDate(deadline);

  if (!normalizedDomain) {
    throw new Error("domain is required");
  }
  if (!deadlineDate) {
    throw new Error("deadline must be a valid date");
  }

  const grantsRef = collection(db, COLLECTIONS.GRANTS);
  const grantsQuery = query(
    grantsRef,
    where("domain", "array-contains", normalizedDomain),
    where("deadline", "<=", deadlineDate)
  );
  const snapshot = await getDocs(grantsQuery);
  const matches = snapshot.docs.map((docSnapshot) => ({
    grant_id: docSnapshot.id,
    ...docSnapshot.data(),
  }));

  console.info(
    `[grantIngestion] testGrantQuery domain=${normalizedDomain} deadline<=${deadlineDate.toISOString()} count=${matches.length}`
  );
  return matches;
}

export async function testEligibilityRead({ sampleSize = 50 } = {}) {
  const grantsRef = collection(db, COLLECTIONS.GRANTS);
  const scanQuery = query(grantsRef, queryLimit(sampleSize));
  const snapshot = await getDocs(scanQuery);

  const missingEligibility = [];

  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    const hasEligibility =
      Object.prototype.hasOwnProperty.call(data, "eligibility") &&
      data.eligibility !== null &&
      data.eligibility !== undefined;

    if (!hasEligibility) {
      missingEligibility.push({
        grant_id: docSnapshot.id,
        external_id: data.external_id ?? null,
      });
    }
  }

  const result = {
    checked: snapshot.size,
    missing_count: missingEligibility.length,
    all_have_eligibility: missingEligibility.length === 0,
    missing_eligibility: missingEligibility,
  };
  console.info(
    `[grantIngestion] testEligibilityRead checked=${result.checked} missing=${result.missing_count}`
  );
  return result;
}
