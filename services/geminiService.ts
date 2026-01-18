
import { GoogleGenAI } from "@google/genai";

// Sử dụng giá trị mặc định nếu process.env.API_KEY chưa có để tránh crash lúc khởi tạo
const apiKey = process.env.API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAIResponse = async (feedback: string) => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Returning default response.");
    return "Cảm ơn ý kiến đóng góp của bạn. Chúng tôi đã ghi nhận và sẽ phản hồi sớm nhất có thể.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: feedback,
      config: {
        systemInstruction: "Bạn là một sĩ quan trực ban thân thiện tại đơn vị quân đội. Nhiệm vụ của bạn là tiếp nhận các góp ý, thắc mắc về việc thăm quân nhân một cách lịch sự, nghiêm túc và đúng tác phong quân đội. Hãy trả lời ngắn gọn, chân thành và hứa sẽ ghi nhận ý kiến của người dân.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Cảm ơn ý kiến đóng góp của bạn. Chúng tôi đã ghi nhận và sẽ phản hồi sớm nhất có thể.";
  }
};
