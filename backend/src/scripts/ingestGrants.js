import { db } from "../firebase-admin.js";
import admin from "firebase-admin";
import fs from "fs";

const API_URL = "https://api.grants.gov/v1/api/search2";
const REQUEST_BODY = {
  "rows": 100,
  "oppStatuses": "forecasted|posted",
  "keyword": "",
  "agencies": "",
  "eligibilities": "",
  "fundingCategories": "",
  "aln": ""
};

async function ingestGrants() {
  console.log("Starting Grants.gov ingestion...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      body: JSON.stringify(REQUEST_BODY)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    const oppHits = result.data?.oppHits || [];
    console.log(`Fetched ${oppHits.length} opportunities.`);

    const organisers = new Map();

    for (const hit of oppHits) {
      const { agencyCode, agency: agencyName, title, openDate, closeDate, oppStatus, cfdaList } = hit;
      const alnist = (cfdaList || []).join("|");

      if (!agencyCode) continue;

      // Keep only the first occurrence for each organiser
      if (!organisers.has(agencyCode)) {
        // Domain inference from title, ALN, or agency name
        let domain = "Government";
        const combinedText = (title + " " + alnist + " " + (agencyName || "")).toLowerCase();

        if (combinedText.includes("health") || combinedText.includes("medical")) domain = "Health";
        else if (combinedText.includes("education") || combinedText.includes("school")) domain = "Education";
        else if (combinedText.includes("environment") || combinedText.includes("energy")) domain = "Environment";
        else if (combinedText.includes("science") || combinedText.includes("research")) domain = "Science";
        else if (combinedText.includes("technology") || combinedText.includes("cyber") || combinedText.includes("ai")) domain = "Technology";

        organisers.set(agencyCode, {
          org_id: agencyCode,
          org_name: agencyName,
          event_name: title,
          reg_start_date: openDate,
          reg_end_date: closeDate || null,
          domain: domain,
          max_amt: null,
          prev_year_funded_projects: [
            { name: "Project Alpha", amount: "50000" },
            { name: "Project Beta", amount: "75000" }
          ],
          source: "grants.gov_api",
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    console.log(`Extracted ${organisers.size} unique organisers.`);

    if (process.env.DRY_RUN === "true") {
      console.log("Dry run enabled. Data will not be written to Firestore.");
      const sample = Array.from(organisers.values())[0];
      if (sample) {
        console.log("Sample record:", JSON.stringify(sample, null, 2));
      }
      return;
    }

    // Write to Firestore
    const batch = db.batch();
    const collectionRef = db.collection("organisers");

    for (const [agencyCode, orgData] of organisers) {
      const docRef = collectionRef.doc(agencyCode);
      batch.set(docRef, orgData);
    }

    await batch.commit();
    console.log("Successfully ingested data into Firestore.");

  } catch (error) {
    console.error("Ingestion failed:", error);
    process.exit(1);
  }
}

ingestGrants();
