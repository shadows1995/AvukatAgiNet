import axios from "axios";

async function runTest() {
    try {
        console.log("Sending test request...");
        const response = await axios.post("http://localhost:80/api/garanti/test-sale", {
            amount: "1.00",
            cardNumber: "9792364832690872",
            expMonth: "12",
            expYear: "28",
            cvv: "579",
            email: "test@example.com"
        });

        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

runTest();
