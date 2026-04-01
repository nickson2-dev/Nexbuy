
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

// Guideline: Always use the process.env.API_KEY directly and initialize per request if needed.
export const getShoppingAdvice = async (query: string, products: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Create a concise product summary to save tokens and focus the AI
    const productSummary = products.map(p => ({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
      isExclusive: p.isExclusive
    })).slice(0, 15); // Limit to top 15 products for context

    const systemInstruction = `You are Nexa, the elite AI shopping consultant for Nexota Store, the premier online tech destination in Uganda. 
    Nexota is the premier high-tech destination in Uganda, focusing on high-end, curated tech and gaming gear. We offer a unique, premium shopping experience that stands alone in the market.
    
    Your tone: Professional, sophisticated, yet helpful and conversational. Use emojis sparingly but effectively.
    Context: You are helping a customer in Uganda. Mention local relevance if appropriate (e.g., "perfect for Kampala's tech scene").
    
    Guidelines:
    1. Recommend products from the provided list.
    2. If a user asks for something not available, suggest the closest alternative.
    3. If the user is a "Lumi Ascend" member (implied by the query context if provided), be extra concierge-like.
    4. Keep responses under 3 sentences. Be punchy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Query: "${query}"\n\nAvailable Assets: ${JSON.stringify(productSummary)}`,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm currently recalibrating my neural circuits. However, based on our current inventory, I highly recommend exploring our latest high-performance assets! 🚀";
  }
};
