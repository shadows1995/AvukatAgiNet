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

export const generateJobDetails = async (courthouse: string, allowedJobTypes?: string[]): Promise<GeneratedJob | null> => {
    if (!apiKey) {
        console.error("Gemini API key is missing.");
        return null;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const jobTypeInstruction = allowedJobTypes && allowedJobTypes.length > 0
            ? `Seçilecek görev türü SADECE şunlardan biri olabilir: ${allowedJobTypes.join(', ')}.`
            : 'Herhangi bir görev türü seçilebilir.';

        const prompt = `
        Sen bir Türk avukatısın. "${courthouse}" için gerçekçi bir tevkil (avukatlar arası iş yardımlaşması) görevi oluşturman gerekiyor.
        
        KURALLAR:
        1. ${jobTypeInstruction}
        2. Eğer görev türü "Diğer" seçilirse, bu görev MUTLAKA idari kurumlarla ilgili olmalı (Örn: Göç İdaresi, Polis Merkezi, Tapu Müdürlüğü, Nüfus Müdürlüğü vb.).
        3. Eğer görev türü "İcra İşlemi" seçilirse, bu görev MUTLAKA icra dairesinde yapılan bir işlem olmalı ve detayları buna uygun olmalı (Örn: Dosya fotokopisi, talep açma, haciz vb.).
        4. Eğer görev türü "Duruşma" seçilirse, mahkeme türü ve duruşma detayları gerçekçi olmalı.
        
        Lütfen aşağıdaki formatta geçerli bir JSON çıktısı ver (Markdown yok, sadece JSON):
        {
            "title": "Kısa ve net bir başlık (Örn: Duruşma Tevkil, Dosya İnceleme, Göç İdaresi Başvuru)",
            "description": "Görevin detaylı açıklaması. Resmi ve profesyonel bir dil kullan. Emoji kullanma. Dosya numarası verme. Tarih olarak bugünü ima et. İcra ise icra dairesi detaylarını, Diğer ise kurum detaylarını içersin.",
            "jobType": "Duruşma" | "İcra İşlemi" | "Dosya İnceleme" | "Haciz" | "Dilekçe" | "Diğer" (Yukarıdaki kısıtlamalara uygun seç)",
            "offeredFee": 800 (Genelde 800 civarı olsun, işin zorluğuna göre 500-1500 arası değişebilir),
            "ownerName": "Rastgele bir Türk avukat ismi (Örn: Av. Ahmet Yılmaz, Av. Ayşe Demir vb.)"
        }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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
