import "dotenv/config";
import { db } from "./backend/src/firebase-admin.js";

async function test() {
    console.log("Testing DB connection...");
    try {
        await db.collection("test_connection").add({ time: new Date() });
        console.log("DB Write Success!");
        process.exit(0);
    } catch (e) {
        console.error("DB Write Failed:", e);
        process.exit(1);
    }
}
test();
