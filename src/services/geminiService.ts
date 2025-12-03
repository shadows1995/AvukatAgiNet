import { google } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

interface GeneratedJob {
    title: string;
    description: string;
    jobType: string;
    offeredFee: number;
    ownerName: string;
}

export const generateJobDetails = async (courthouse: string): Promise<GeneratedJob | null> => {
    if (!apiKey) {
        console.error("Gemini API key is missing.");
        return null;
    }

    try {
        const client = new google.GenAI({ apiKey });
        const model = client.generativeModel("gemini-1.5-flash");

        const prompt = `
        Sen bir Türk avukatısın. "${courthouse}" için gerçekçi bir tevkil (avukatlar arası iş yardımlaşması) görevi oluşturman gerekiyor.
        
        Lütfen aşağıdaki formatta geçerli bir JSON çıktısı ver (Markdown yok, sadece JSON):
        {
            "title": "Kısa ve net bir başlık (Örn: Duruşma Tevkil, Dosya İnceleme)",
            "description": "Görevin detaylı açıklaması. Resmi ve profesyonel bir dil kullan. Emoji kullanma. Dosya numarası verme. Tarih olarak bugünü ima et.",
            "jobType": "Duruşma" | "İcra İşlemi" | "Dosya İnceleme" | "Haciz" | "Dilekçe" | "Diğer" (Bunlardan birini seç)",
            "offeredFee": 800 (Genelde 800 civarı olsun, işin zorluğuna göre 500-1500 arası değişebilir),
            "ownerName": "Rastgele bir Türk avukat ismi (Örn: Av. Ahmet Yılmaz, Av. Ayşe Demir vb.)"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr) as GeneratedJob;
        return data;

    } catch (error) {
        console.error("Error generating job details with Gemini:", error);
        return null;
    }
};
