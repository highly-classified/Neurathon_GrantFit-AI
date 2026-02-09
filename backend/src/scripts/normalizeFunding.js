import { db } from "../firebase-admin.js";

function roundToNearestThousand(value) {
  if (typeof value !== "number") return value;
  return Math.round(value / 1000) * 1000;
}

async function normalizeFunding() {
  console.log("Starting funding normalization...");

  try {
    const collectionRef = db.collection("organisers");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No organiser documents found.");
      return;
    }

    console.log(`Processing ${snapshot.size} documents...`);

    const batch = db.batch();
    let count = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const updates = {};

      // Normalize organiser-level funding fields
      if (data.funding_profile) {
        const maxEst = roundToNearestThousand(data.funding_profile.max_amt_estimated);
        const minEst = roundToNearestThousand(data.funding_profile.min_amt_estimated);

        if (maxEst !== data.funding_profile.max_amt_estimated || minEst !== data.funding_profile.min_amt_estimated) {
          updates.funding_profile = {
            ...data.funding_profile,
            max_amt_estimated: maxEst,
            min_amt_estimated: minEst
          };

          // Keep top-level max_amt consistent
          updates.max_amt = maxEst;
        }
      }

      // Normalize top-level max_amt if it exists and wasn't updated above
      if (data.max_amt !== undefined && !updates.max_amt) {
        const roundedMax = roundToNearestThousand(data.max_amt);
        if (roundedMax !== data.max_amt) {
          updates.max_amt = roundedMax;
        }
      }

      // Normalize previous-year funded project amounts
      if (Array.isArray(data.prev_year_funded_projects)) {
        const normalizedProjects = data.prev_year_funded_projects.map((project) => ({
          ...project,
          funding: roundToNearestThousand(project.funding)
        }));

        // Check if projects actually changed
        const projectsChanged = JSON.stringify(normalizedProjects) !== JSON.stringify(data.prev_year_funded_projects);
        if (projectsChanged) {
          updates.prev_year_funded_projects = normalizedProjects;
        }
      }

      if (Object.keys(updates).length > 0) {
        if (process.env.DRY_RUN === "true") {
          console.log(`[DRY RUN] Would normalize ${doc.id}:`, JSON.stringify(updates, null, 2));
        } else {
          batch.set(doc.ref, updates, { merge: true });
        }
        count++;
      }
    });

    if (process.env.DRY_RUN !== "true" && count > 0) {
      await batch.commit();
      console.log(`Successfully normalized ${count} organisers in Firestore.`);
    } else if (process.env.DRY_RUN === "true") {
      console.log(`[DRY RUN] Would have normalized ${count} documents.`);
    } else {
      console.log("No documents required normalization.");
    }

  } catch (error) {
    console.error("Normalization failed:", error);
    process.exit(1);
  }
}

normalizeFunding();
