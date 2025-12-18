
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const generateJobDetails = async (courthouse, allowedJobTypes) => {
    if (!apiKey) {
        console.error("Gemini API key is missing.");
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const jobTypeInstruction = allowedJobTypes && allowedJobTypes.length > 0
            ? `Seçilecek görev türü SADECE şunlardan biri olabilir: ${allowedJobTypes.join(', ')}.`
            : 'Herhangi bir görev türü seçilebilir.';

        const prompt = `
        Sen bir Türk avukatısın. "${courthouse}" için gerçekçi bir tevkil (avukatlar arası iş yardımlaşması) görevi oluşturman gerekiyor.
        
        KURALLAR:
        1. ${jobTypeInstruction}
        2. GÖREV TÜRÜ "Diğer" İSE: Konu mutlaka idari kurumlarla (Göç İdaresi, Tapu, Nüfus vb.) ilgili olmalı.
        3. GÖREV TÜRÜ "İcra İşlemi" İSE: Konu mutlaka icra dairesindeki fiziksel işlemlerle ilgili olmalı (fotokopi, haciz vb.).
        4. GÖREV TÜRÜ "Duruşma" İSE: Mahkeme türü belirtilmeli ama çok detaya girilmemeli.

        EĞER GÖREV TÜRÜ "Duruşma" İSE BAŞLIK KURALI:
        - Başlık SADECE mahkeme türünü içermeli. Asla dosya detayı veya uzun açıklama olmamalı.
        - Örnek Başlıklar: "Asliye Ceza Tevkil", "İş Mahkemesi Tevkil", "Ağır Ceza Duruşma", "Sulh Hukuk Tevkil".
        
        EĞER DİĞER TÜRDE İSE BAŞLIK KURALI:
        - Başlık çok kısa ve genel olmalı.
        - Örnekler: "Tapu İşlemi", "İcra Dosya İnceleme", "Haciz İşlemi", "Karakol İfade".

        AÇIKLAMA KURALI (ÇOK ÖNEMLİ):
        - Kesinlikle "Abi", "Abla", "Kardeşim" gibi laubali ifadeler kullanma.
        - Resmi, kısa ve net bir avukat dili kullan.
        - SADECE 2 CÜMLE OLSUN. Uzatmak yasak.
        - Durumu net bir şekilde ifade et ve yardım iste.
        - Örnek: "Duruşmaya katılım sağlayamayacağız. Önemli bir duruşma, meslektaş desteği rica olunur."
        - Örnek: "İcra dairesinde dosya fotokopisi alınması gerekmektedir. Yardımcı olabilecek meslektaşımız var mı?"

        ÜCRET KURALI:
        - Genelde 800 - 1500 TL arası makul bir ücret ver.
        - ANCAK "Duruşma" görevi ise ücret KESİNLİKLE 900 TL'den az olamaz (En az 900 TL).
        
        Lütfen aşağıdaki formatta geçerli bir JSON çıktısı ver (Markdown yok, sadece JSON):
        {
            "title": "Kısa ve genel başlık (Yukarıdaki kurallara uygun)",
            "description": "2 cümlelik, samimi, insansı açıklama.",
            "jobType": "Duruşma" | "İcra İşlemi" | "Dosya İnceleme" | "Haciz" | "Dilekçe" | "Diğer",
            "offeredFee": 1200,
            "ownerName": "Rastgele Ad Soyad"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr);
        return data;

    } catch (error) {
        console.error("Error generating job details with Gemini:", error);
        return null;
    }
};
