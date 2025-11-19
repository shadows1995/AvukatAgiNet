import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to generate a professional legal job description based on brief inputs.
 */
export const refineJobDescription = async (
  type: string,
  courthouse: string,
  rawDetails: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Bir avukat için profesyonel bir görev tanımı (vekalet görevi) oluştur. 
      Bu görev, başka bir avukata devredilecektir. 
      
      Görev Türü: ${type}
      Yer/Adliye: ${courthouse}
      Kullanıcının girdiği notlar: "${rawDetails}"

      Lütfen resmi, net ve hukuki bir dille kısa bir paragraf yaz. 
      Önemli detayları (dosya no, mahkeme kalemi vb.) yer tutucu olarak [Köşeli Parantez] içinde belirt ki kullanıcı doldurabilsin.
      Sadece açıklama metnini döndür, başlık veya imza ekleme.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || rawDetails;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return rawDetails; // Fallback to original text
  }
};
