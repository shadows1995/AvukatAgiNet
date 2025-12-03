"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function runTest() {
    try {
        console.log("Sending test request...");
        const response = await axios_1.default.post("http://localhost:80/api/garanti/test-sale", {
            amount: "1.00",
            cardNumber: "9792364832690872",
            expMonth: "12",
            expYear: "28",
            cvv: "579",
            email: "test@example.com"
        });
        console.log("Response:", JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}
runTest();
