
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("Debugging Job Bot / Test User Model: gemini-2.5-flash-lite...");
try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("Response:", response.text());

} catch (error) {
    console.error("Error Full:", error);
}
