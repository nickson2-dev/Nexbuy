
import { GoogleGenAI, Type } from "@google/genai";

// Guideline: Always use the process.env.API_KEY directly and initialize per request if needed.
export const getShoppingAdvice = async (query: string, products: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User asks: "${query}". Based on these products: ${JSON.stringify(products)}, recommend the best one. Give a very short, friendly, conversational response. Be concise. Use emojis.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Guideline: response.text is a property, not a method.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble thinking right now, but I'd suggest our best-seller, the Nexbuy Pro Vision! 🚀";
  }
};
