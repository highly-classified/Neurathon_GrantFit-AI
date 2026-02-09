import { db } from "../firebase-admin.js";

const ENRICHMENT_MAPPING = {
  "NSF": {
    "funding_profile": {
      "max_amt_estimated": 5000000,
      "min_amt_estimated": 50000,
      "basis": "historical grants and public information",
      "confidence": "high"
    },
    "prev_year_funded_projects": [
      {
        "project_name": "Quantum Computing Research Initiative",
        "funding": 1200000,
        "domain": "Science",
        "idea_summary": "Advancing quantum algorithms for cryptographic applications.",
        "year": 2024,
        "tags": ["Quantum", "Computing", "Cryptography"]
      },
      {
        "project_name": "AI for Sustainable Energy",
        "funding": 850000,
        "domain": "Technology",
        "idea_summary": "Using machine learning to optimize power grid distribution.",
        "year": 2023,
        "tags": ["AI", "Energy", "Sustainability"]
      }
    ]
  },
  "HHS-NIH11": {
    "funding_profile": {
      "max_amt_estimated": 10000000,
      "min_amt_estimated": 100000,
      "basis": "historical grants and public information",
      "confidence": "high"
    },
    "prev_year_funded_projects": [
      {
        "project_name": "Cancer Genomics Data Portal",
        "funding": 2500000,
        "domain": "Health",
        "idea_summary": "Creating a central repository for genomic data in oncology.",
        "year": 2024,
        "tags": ["Cancer", "Genomics", "Data"]
      },
      {
        "project_name": "Neural Mapping Project",
        "funding": 1800000,
        "domain": "Health",
        "idea_summary": "High-resolution mapping of neural circuits in the human brain.",
        "year": 2023,
        "tags": ["Neurology", "Research"]
      }
    ]
  },
  "DOI-NPS": {
    "funding_profile": {
      "max_amt_estimated": 2000000,
      "min_amt_estimated": 10000,
      "basis": "historical grants and public information",
      "confidence": "medium"
    },
    "prev_year_funded_projects": [
      {
        "project_name": "Coastal Erosion Mitigation",
        "funding": 450000,
        "domain": "Environment",
        "idea_summary": "Implementing nature-based solutions to prevent shoreline loss.",
        "year": 2024,
        "tags": ["Conservation", "Coastline"]
      }
    ]
  },
  "HHS-OPHS": {
    "funding_profile": {
      "max_amt_estimated": 3000000,
      "min_amt_estimated": 50000,
      "basis": "historical grants and public information",
      "confidence": "medium"
    },
    "prev_year_funded_projects": [
      {
        "project_name": "Community Health Awareness Program",
        "funding": 300000,
        "domain": "Health",
        "idea_summary": "Promoting wellness and preventative care in underserved communities.",
        "year": 2024,
        "tags": ["Wellness", "Community"]
      }
    ]
  }
};

async function enrichOrganisers() {
  console.log("Starting Organisers enrichment...");

  try {
    const collectionRef = db.collection("organisers");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No organiser documents found to enrich.");
      return;
    }

    console.log(`Found ${snapshot.size} documents in 'organisers' collection.`);

    const batch = db.batch();
    let updatedCount = 0;

    snapshot.forEach(doc => {
      const orgId = doc.id;
      const enrichmentData = ENRICHMENT_MAPPING[orgId];

      if (enrichmentData) {
        if (process.env.DRY_RUN === "true") {
          console.log(`[DRY RUN] Would enrich ${orgId} with:`, JSON.stringify(enrichmentData, null, 2));
        } else {
          const docRef = collectionRef.doc(orgId);
          batch.set(docRef, enrichmentData, { merge: true });
        }
        updatedCount++;
      }
    });

    if (process.env.DRY_RUN !== "true" && updatedCount > 0) {
      await batch.commit();
      console.log(`Successfully enriched ${updatedCount} organisers in Firestore.`);
    } else if (process.env.DRY_RUN === "true") {
      console.log(`[DRY RUN] Would have enriched ${updatedCount} organisers.`);
    } else {
      console.log("No matching organisers found in enrichment mapping.");
    }

  } catch (error) {
    console.error("Enrichment failed:", error);
    process.exit(1);
  }
}

enrichOrganisers();
