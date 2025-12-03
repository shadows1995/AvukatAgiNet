import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

console.log("🔑 API Key found (starts with):", apiKey.substring(0, 5) + "...");

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("📡 Fetching available models...");
        const response = await ai.models.list();

        console.log("\n✅ Available Models:");
        // The response structure might vary, let's log it safely
        if (response && response.models) {
            response.models.forEach(model => {
                console.log(`- ${model.name} (${model.displayName})`);
            });
        } else {
            console.log("Raw response:", JSON.stringify(response, null, 2));
        }

    } catch (error) {
        console.error("❌ Error listing models:", error);
    }
}

listModels();
