
import { GoogleGenAI } from "@google/genai";

// Fixed: Initialize GoogleGenAI with a named parameter and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIResponse = async (feedback: string) => {
  try {
    // Fixed: Call generateContent directly on ai.models
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: feedback,
      config: {
        systemInstruction: "Bạn là một sĩ quan trực ban thân thiện tại đơn vị quân đội. Nhiệm vụ của bạn là tiếp nhận các góp ý, thắc mắc về việc thăm quân nhân một cách lịch sự, nghiêm túc và đúng tác phong quân đội. Hãy trả lời ngắn gọn, chân thành và hứa sẽ ghi nhận ý kiến của người dân.",
      },
    });
    // Fixed: Use .text property instead of calling .text() method
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Cảm ơn ý kiến đóng góp của bạn. Chúng tôi đã ghi nhận và sẽ phản hồi sớm nhất có thể.";
  }
};
