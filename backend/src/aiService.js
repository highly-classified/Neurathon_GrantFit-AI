import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import "dotenv/config";

const CACHE_FILE = path.join(process.cwd(), "ai_cache.json");
const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const DRY_RUN = process.env.G_DRY_RUN === "true";

// Initialize Gemini
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

/**
 * Loads the persistent cache from disk.
 */
function loadCache() {
    if (fs.existsSync(CACHE_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
        } catch (e) {
            console.warn("Failed to parse AI cache, starting fresh.");
        }
    }
    return {};
}

/**
 * Saves the persistent cache to disk.
 */
function saveCache(cache) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Calls Gemini with a prompt and a unique cache key.
 * If cacheKey exists in ai_cache.json, it returns the cached result.
 */
export async function callGemini(prompt, cacheKey, mockResponse = "MOCK_AI_RESPONSE") {
    if (DRY_RUN) {
        console.log(`[AI-DRY-RUN] Mocking response for: ${cacheKey}`);
        return mockResponse;
    }

    const cache = loadCache();
    if (cache[cacheKey]) {
        console.log(`[AI-CACHE] Returning cached result for: ${cacheKey}`);
        return cache[cacheKey];
    }

    if (!model) {
        throw new Error("GOOGLE_GENAI_API_KEY is missing. Please add it to your .env file.");
    }

    console.log(`[AI-API-CALL] Calling Gemini for: ${cacheKey}...`);
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Save to cache
        cache[cacheKey] = text;
        saveCache(cache);

        return text;
    } catch (error) {
        console.error(`[AI-ERROR] Gemini call failed: ${error.message}`);
        throw error;
    }
}
