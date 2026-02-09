import { db } from "../firebase-admin.js";
import admin from "firebase-admin";

const DOMAIN_POOL = ["AI", "Health", "Clean Energy", "Education", "Agriculture", "Defense", "Climate", "General"];

const FUNDING_RANGES = {
  "AI": { min: 250000, max: 1500000 },
  "Health": { min: 250000, max: 1500000 },
  "Clean Energy": { min: 500000, max: 3000000 },
  "Climate": { min: 500000, max: 3000000 },
  "Education": { min: 100000, max: 500000 },
  "Agriculture": { min: 100000, max: 500000 },
  "Defense": { min: 200000, max: 2000000 },
  "General": { min: 50000, max: 300000 }
};

const PROJECT_TEMPLATES = {
  "AI": [
    { name: "Predictive Analytics for Urban Mobility", summary: "Developing AI models to optimize traffic flow and reduce congestion." },
    { name: "Synthetic Reasoning in Legal Documents", summary: "NLP-driven analysis for identifying clauses in large scale contracts." }
  ],
  "Health": [
    { name: "AI-Based Disease Forecasting", summary: "Machine learning models used to predict early outbreak patterns." },
    { name: "Precision Genomics Dashboard", summary: "Visualizing genetic markers for personalized treatment plans." }
  ],
  "Clean Energy": [
    { name: "Solar Grid Integration Study", summary: "Analyzing the efficiency of integrating solar farms into the national grid." },
    { name: "Next-Gen Battery Storage Solutions", summary: "Researching high-density lithium alternatives for energy storage." }
  ],
  "Education": [
    { name: "Adaptive Learning Platform for Rural Schools", summary: "Providing AI-balanced curriculum delivery in low-bandwidth areas." },
    { name: "Digital Literacy Bootcamps", summary: "Targeting adult learners for workforce re-entry in tech sectors." }
  ],
  "General": [
    { name: "Civic Infrastructure Revitalization", summary: "Planning small-scale upgrades for regional community centers." },
    { name: "Public Innovation Partnership", summary: "Fostering collaboration between regional businesses and local government." }
  ]
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function inferDomain(org) {
  const text = ((org.event_name || "") + " " + (org.org_name || "") + " " + (org.domain || "")).toLowerCase();

  if (text.includes("ai") || text.includes("machine learning") || text.includes("intelligence")) return "AI";
  if (text.includes("health") || text.includes("medical") || text.includes("cancer") || text.includes("disease")) return "Health";
  if (text.includes("energy") || text.includes("solar") || text.includes("fusion")) return "Clean Energy";
  if (text.includes("climate") || text.includes("environment") || text.includes("pollution")) return "Climate";
  if (text.includes("education") || text.includes("school") || text.includes("learning")) return "Education";
  if (text.includes("agri") || text.includes("farm") || text.includes("crop")) return "Agriculture";
  if (text.includes("defense") || text.includes("military") || text.includes("army")) return "Defense";

  // Weighted fallback if confidence is low
  const rand = Math.random();
  if (rand < 0.6) return "General";
  return DOMAIN_POOL[Math.floor(Math.random() * DOMAIN_POOL.length)];
}

function generateActiveWindow() {
  const startYear = 2024;
  const endYear = 2026;
  const startMonth = getRandomInt(1, 12).toString().padStart(2, '0');
  const startDay = getRandomInt(1, 28).toString().padStart(2, '0');
  const endMonth = getRandomInt(1, 12).toString().padStart(2, '0');
  const endDay = getRandomInt(1, 28).toString().padStart(2, '0');

  return {
    start: `${startYear}-${startMonth}-${startDay}`,
    end: `${endYear}-${endMonth}-${endDay}`,
    source: "synthetic_enrichment",
    confidence: "medium"
  };
}

function generateFundingProfile(domain) {
  const range = FUNDING_RANGES[domain] || FUNDING_RANGES["General"];
  const max = getRandomInt(range.min + (range.max - range.min) / 2, range.max);
  const min = getRandomInt(range.min, max - 10000);

  return {
    max_amt_estimated: max,
    min_amt_estimated: min,
    basis: "synthetic_domain_model",
    confidence: "medium"
  };
}

function generateProjects(domain, fundingProfile) {
  const templates = PROJECT_TEMPLATES[domain] || PROJECT_TEMPLATES["General"];
  const numProjects = getRandomInt(1, 2);
  const projects = [];

  for (let i = 0; i < numProjects; i++) {
    const template = templates[i % templates.length];
    projects.push({
      project_name: template.name,
      funding: getRandomInt(fundingProfile.min_amt_estimated, fundingProfile.max_amt_estimated),
      domain: domain + " Research",
      idea_summary: template.summary,
      year: getRandomInt(2022, 2024),
      tags: [domain.toLowerCase().replace(/ /g, "_"), "synthetic", "historical"]
    });
  }

  return projects;
}

async function forceEnrich() {
  console.log("Starting Advanced Force Enrichment...");

  try {
    const collectionRef = db.collection("organisers");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No organisers found.");
      return;
    }

    const batch = db.batch();
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const domain = inferDomain(data);
      const activeWindow = generateActiveWindow();
      const fundingProfile = generateFundingProfile(domain);
      const projects = generateProjects(domain, fundingProfile);

      const enrichment = {
        domain: domain,
        org_active_window: activeWindow,
        funding_profile: fundingProfile,
        prev_year_funded_projects: projects,
        max_amt: fundingProfile.max_amt_estimated, // Update top-level max_amt too
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      };

      console.log(`Enriching ${doc.id}:`);
      console.log(`  Before: domain=${data.domain}, projectsCount=${(data.prev_year_funded_projects || []).length}`);
      console.log(`  After:  domain=${domain}, projectsCount=${projects.length}`);

      if (process.env.DRY_RUN !== "true") {
        batch.set(doc.ref, enrichment, { merge: true });
      }
      count++;
    });

    if (process.env.DRY_RUN !== "true") {
      await batch.commit();
      console.log(`Successfully forced enrichment for ${count} documents.`);
    } else {
      console.log(`[DRY RUN] Would have enriched ${count} documents.`);
    }

  } catch (error) {
    console.error("Force enrichment failed:", error);
    process.exit(1);
  }
}

forceEnrich();
