import { db } from "../firebase-admin.js";

const ALLOWED_CITIZENSHIP = ["US", "IN", "UK", "CA", "EU", "any"];
const COUNTRIES_ONLY = ["US", "IN", "UK", "CA", "EU"];

async function updateCitizenship() {
  console.log("Starting citizenship update...");

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

    snapshot.forEach((doc) => {
      let assigned = [];

      // Rule: 30-40% should have "any". We'll use 35% probability.
      const shouldHaveAny = Math.random() < 0.35;

      if (shouldHaveAny) {
        assigned.push("any");
        // Optionally add one more from the countries (50% chance for a second value)
        if (Math.random() < 0.5) {
          const randomCountry = COUNTRIES_ONLY[Math.floor(Math.random() * COUNTRIES_ONLY.length)];
          assigned.push(randomCountry);
        }
      } else {
        // Pick 1 or 2 from the countries only
        const numToPick = Math.random() < 0.7 ? 1 : 2; // 70% chance for 1, 30% for 2
        const shuffled = [...COUNTRIES_ONLY].sort(() => 0.5 - Math.random());
        assigned = shuffled.slice(0, numToPick);
      }

      const updateData = {
        eligibility_criteria: {
          citizenship: assigned
        }
      };

      if (process.env.DRY_RUN === "true") {
        console.log(`[DRY RUN] ${doc.id} -> ${JSON.stringify(assigned)}`);
      } else {
        batch.set(doc.ref, updateData, { merge: true });
      }
      count++;
    });

    if (process.env.DRY_RUN !== "true") {
      await batch.commit();
      console.log(`Successfully updated citizenship for ${count} organisers.`);
    } else {
      console.log(`[DRY RUN] Would have updated ${count} organisers.`);
    }

  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
}

updateCitizenship();
