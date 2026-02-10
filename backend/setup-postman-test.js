import "dotenv/config";
import { db } from "./src/firebase-admin.js";
import { COLLECTIONS } from "./src/firestore/collections.js";

async function setupTestData() {
    console.log("🛠️ Setting up 10 diverse test grants...");

    const grants = [
        {
            id: "ai-compute-grant",
            org_name: "Postman AI Labs",
            event_name: "2026 AI Compute Challenge",
            domain: "Technology",
            tags: ["AI", "Software", "Compute"],
            prev_year_funded_projects: ["LLM Optimization", "Neural Architecture Search"]
        },
        {
            id: "urban-energy-grant",
            org_name: "Green Future Foundation",
            event_name: "Urban Energy Solutions Grant",
            domain: "Energy",
            tags: ["Renewable Energy", "Urban Planning", "Wind"],
            prev_year_funded_projects: ["Solar Grid Management", "Offshore Wind Turbines"]
        },
        {
            id: "quantum-innovation-grant",
            org_name: "Quantum Leap Fund",
            event_name: "Next-Gen Quantum Computing",
            domain: "Technology",
            tags: ["Quantum", "Hardware", "Encryption"],
            prev_year_funded_projects: ["Qubit Stability Research", "Ion Trap Cooling"]
        },
        {
            id: "biotech-seed-fund",
            org_name: "BioGen Systems",
            event_name: "Biotech Early-Stage Seed",
            domain: "Science",
            tags: ["Biotechnology", "Genetics", "Health"],
            prev_year_funded_projects: ["CRISPR Delivery Methods", "Synthetic Protein Design"]
        },
        {
            id: "space-tech-challenge",
            org_name: "OrbitX Venture",
            event_name: "Deep Space Logistics",
            domain: "Technology",
            tags: ["Space", "Satellite", "Robotics"],
            prev_year_funded_projects: ["Satellite Refueling", "Lunar Habitats"]
        },
        {
            id: "edu-tech-global",
            org_name: "Global Education Initiative",
            event_name: "2026 EduTech Grant",
            domain: "Education",
            tags: ["Software", "Learning", "Accessibility"],
            prev_year_funded_projects: ["AI Tutors for Literacy", "VR Classroom Tools"]
        },
        {
            id: "clean-water-fund",
            org_name: "HydroPure Org",
            event_name: "Clean Water Access 2026",
            domain: "Sustainability",
            tags: ["Water", "Filtration", "Public Health"],
            prev_year_funded_projects: ["Desalination Tech", "Groundwater Monitoring"]
        },
        {
            id: "security-privacy-grant",
            org_name: "SafeGuard Tech",
            event_name: "Privacy-Preserving Tech",
            domain: "Technology",
            tags: ["Privacy", "Encryption", "Security"],
            prev_year_funded_projects: ["Homomorphic Encryption", "Zero-Knowledge Proofs"]
        },
        {
            id: "sustainable-agri-fund",
            org_name: "AgriNext",
            event_name: "Sustainable Agriculture 2026",
            domain: "Sustainability",
            tags: ["Farming", "Soil Science", "Agtech"],
            prev_year_funded_projects: ["Hydroponics for Cities", "Drought-Resistant Crops"]
        },
        {
            id: "smart-grid-innovation",
            org_name: "GridLink Energy",
            event_name: "Smart Grid Integration Fund",
            domain: "Energy",
            tags: ["Renewable Energy", "Software", "IoT"],
            prev_year_funded_projects: ["Decentralized Grids", "Battery Storage Software"]
        }
    ];

    for (const grant of grants) {
        await db.collection(COLLECTIONS.ORGANIZERS).doc(grant.id).set({
            ...grant,
            created_at: new Date()
        });
    }

    console.log(`🛠️ Setting up test user profiles...`);

    // User 1: AI Focus
    await db.collection(COLLECTIONS.USERS).doc("user_postman_01").set({
        displayName: "AI Researcher",
        email: "ai@test.com",
        role: "Researcher",
        domain: "Artificial Intelligence",
        idea: "Optimizing compute for large language models",
        fundingRequirement: "50000",
        citizenship: "India",
        created_at: new Date()
    });

    // User 2: Energy Focus
    await db.collection(COLLECTIONS.USERS).doc("user_energy_01").set({
        displayName: "Energy Startup",
        email: "energy@test.com",
        role: "Founder",
        domain: "Renewable Energy",
        idea: "Implementing smart grids in urban centers",
        fundingRequirement: "250000",
        citizenship: "India",
        created_at: new Date()
    });

    console.log(`✅ Setup complete! 10 grants and 2 users ready.`);
    process.exit(0);
}

setupTestData();
