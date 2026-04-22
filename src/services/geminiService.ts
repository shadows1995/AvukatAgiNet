import { GoogleGenerativeAI } from "@google/generative-ai";
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
        const genAI = new GoogleGenerativeAI(apiKey);


        const firstNames = ["Ahmet", "Mehmet", "Ali", "Can", "Burak", "Emre", "Barış", "Hüseyin", "Yusuf", "Mustafa", "Murat", "Hakan", "Oğuz", "Osman", "Fatih", "Serkan", "Gökhan", "Yasin", "İbrahim", "Kemal", "Ayşe", "Fatma", "Zeynep", "Elif", "Merve", "Büşra", "Ceren", "Derya", "Esra", "Gizem", "Seda", "Meltem", "Aslı", "Burcu", "Dilek", "Betül", "Tuğba", "Kübra", "Yasemin"];
        const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Öz", "Erdoğan", "Yavuz", "Can", "Acar", "Güneş", "Bozkurt", "Turan", "Yalçın", "Güler"];
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const generatedOwnerName = `Av. ${randomFirstName} ${randomLastName}`;

        const prompt = `
        Sen Türkiye'de yoğun çalışan bir avukatsın ve tevkil (başka bir avukattan iş için yardım alma) platformuna bir görev ilanı açıyorsun. İlanın GERÇEK BİR İNSAN tarafından yazılmış gibi tamamen doğal, günlük avukat jargonuyla ve her defasında birbirinden FARKLI stillerde olmalı. Kesinlikle robotik veya kalıp cümleler (örn: "Önemli bir duruşma, destek rica olunur") kullanma.

        GÖREV BİLGİLERİ:
        - Adliye: ${courthouse}
        - Geçerli Görev Türleri: ${allowedJobTypes ? allowedJobTypes.join(', ') : 'Herhangi bir tür'}

        KURALLAR:
        1. Asla selamlama ifadeleri kullanma ("Merhaba", "İyi çalışmalar", "Değerli meslektaşlar" vb. YASAK). Her zaman doğrudan konuya ve göreve başla.
        2. İçerik ve Mazeret: Görevin içeriğiyle ilgili doğrudan, net bilgiler ver. Mazeretler çok detaylı olmasın, olabildiğince net, kısa ve doğal olsun (örneğin: "Başka duruşmayla çakıştığı için", "Şehir dışında olacağım için", "Dosyadan belge sureti alınacak"). Gereksiz uzun hikayelere girme.
        3. Başlıklar: Kesinlikle mahkeme numarası veya adliye numarası KULLANMA. İçi boş ve aşırı tekrar eden başlıklar yerine, görevin niteliğini belirten kısa ve farklı başlıklar at. Örnek: "Asliye Ceza Duruşması", "İş Mahkemesi Tanık Beyanı", "İcra Dairesinde Haciz İşlemi", "Karakol İfade Temsili".
        4. Ücret: Genelde 800 - 1500 TL arası makul bir ücret ver. ANCAK "Duruşma" görevi ise ücret KESİNLİKLE 900 TL'den az olamaz (En az 900 TL).
        5. Asla markdown veya ekstra metin kullanma! Sadece aşağıdaki yapıda JSON olarak yanıt ver.

        ÇIKTI FORMATI:
        {
            "title": "Kısa, numarasız, doğal başlık (Örn: Aile Mahkemesi Ön İnceleme Duruşması)",
            "description": "Selamlamasız, direkt konuya giren, kısa ve doğal mazeretli açıklama",
            "jobType": "Duruşma" | "İcra İşlemi" | "Dosya İnceleme" | "Haciz" | "Dilekçe" | "Diğer",
            "offeredFee": 1200
        }
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr) as GeneratedJob;
        data.ownerName = generatedOwnerName;
        return data;

    } catch (error) {
        console.error("Error generating job details with Gemini:", error);
        return null;
    }
};
