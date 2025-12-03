import { GoogleGenAI } from "@google/genai";
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
        // Initialize the new SDK client
        // The docs say: const ai = new GoogleGenAI({}); and it picks up GEMINI_API_KEY env var.
        // But we can also pass it explicitly if needed, though the constructor might not take { apiKey }.
        // Let's try passing it if the type allows, otherwise rely on env var.
        // Based on user docs: const ai = new GoogleGenAI({});
        // Let's rely on process.env.GEMINI_API_KEY being set (which we know it is).
        const ai = new GoogleGenAI({ apiKey });

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

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        });

        const text = response.text;

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr) as GeneratedJob;
        return data;

    } catch (error) {
        console.error("Error generating job details with Gemini:", error);
        return null;
    }
};
