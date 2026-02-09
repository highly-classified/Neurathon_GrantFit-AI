import { db } from "../firebase-admin.js";
import admin from "firebase-admin";

const CAREER_STAGES = [
  "undergraduate",
  "graduate",
  "postdoctoral",
  "early_career",
  "mid_career",
  "senior",
  "startup_founder",
  "faculty"
];

const CITIZENSHIP_OPTIONS = [
  "US_citizen",
  "permanent_resident",
  "international",
  "any"
];

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function inferEligibility(org) {
  const text = ((org.event_name || "") + " " + (org.org_name || "") + " " + (org.domain || "")).toLowerCase();
  const orgName = (org.org_name || "").toLowerCase();

  // 1. Career Stage Inference
  let careerStages = [];

  if (text.includes("student") || text.includes("fellowship") || text.includes("scholarship")) {
    careerStages.push("undergraduate", "graduate");
  }

  if (text.includes("faculty") || text.includes("professor") || text.includes("institution")) {
    careerStages.push("faculty", "senior");
  }

  if (text.includes("early career") || text.includes("junior faculty") || text.includes("young investigator")) {
    careerStages.push("early_career", "postdoctoral");
  }

  if (text.includes("startup") || text.includes("entrepreneur") || text.includes("innovation") || text.includes("sbir") || text.includes("sttr")) {
    careerStages.push("startup_founder", "early_career");
  }

  // Fallback / Randomize if weak
  if (careerStages.length < 2) {
    const randomCount = Math.floor(Math.random() * 3) + 2; // 2-4 stages
    careerStages = [
      ...careerStages,
      ...getRandomItems(CAREER_STAGES.filter(s => !careerStages.includes(s)), randomCount - careerStages.length)
    ];
  }

  // Ensure mandatory inclusion rule
  const mandatoryStages = ["early_career", "startup_founder", "faculty"];
  if (!careerStages.some(s => mandatoryStages.includes(s))) {
    careerStages.push(mandatoryStages[Math.floor(Math.random() * mandatoryStages.length)]);
  }

  // 2. Citizenship Inference
  let citizenship = [];

  // If US Federal Agency (common patterns in grants.gov data)
  const isUSFederal = org.org_id?.startsWith("HHS") || org.org_id?.startsWith("NSF") ||
    org.org_id?.startsWith("DOI") || org.org_id?.startsWith("DOD") ||
    org.org_id?.startsWith("DOE") || org.org_id?.startsWith("DOS") ||
    orgName.includes("u.s.") || orgName.includes("national") || orgName.includes("department of");

  if (isUSFederal) {
    citizenship = ["US_citizen", "permanent_resident"];
  } else if (text.includes("international") || text.includes("global") || text.includes("world")) {
    citizenship = ["international"];
  } else {
    citizenship = ["any"];
  }

  return {
    career_stage: [...new Set(careerStages)],
    citizenship: [...new Set(citizenship)],
    confidence: "medium",
    source: "synthetic_policy_v1"
  };
}

async function enrichEligibility() {
  console.log("Starting Eligibility Enrichment...");

  try {
    const collectionRef = db.collection("organisers");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No organisers found.");
      return;
    }

    console.log(`Processing ${snapshot.size} documents...`);

    const batch = db.batch();
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const eligibility = inferEligibility(data);

      console.log(`Enriching ${doc.id}:`);
      console.log(`  Career Stages: ${eligibility.career_stage.join(", ")}`);
      console.log(`  Citizenship:   ${eligibility.citizenship.join(", ")}`);

      if (process.env.DRY_RUN !== "true") {
        batch.set(doc.ref, { eligibility_criteria: eligibility }, { merge: true });
      }
      count++;
    });

    if (process.env.DRY_RUN !== "true") {
      await batch.commit();
      console.log(`Successfully enriched ${count} organisers with eligibility criteria.`);
    } else {
      console.log(`[DRY RUN] Would have enriched ${count} documents.`);
    }

  } catch (error) {
    console.error("Eligibility enrichment failed:", error);
    process.exit(1);
  }
}

enrichEligibility();
