
import { GoogleGenAI } from "@google/genai";

export const getAIResponse = async (feedback: string) => {
  // Lấy API Key từ môi trường hoặc define của Vite
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : "";

  if (!apiKey) {
    console.warn("Gemini API Key is missing. Returning default response.");
    return "Cảm ơn ý kiến đóng góp của bạn. Chúng tôi đã ghi nhận và sẽ phản hồi sớm nhất có thể.";
  }

  try {
    // Khởi tạo instance ngay trước khi gọi để đảm bảo lấy key mới nhất
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: feedback,
      config: {
        systemInstruction: "Bạn là một sĩ quan trực ban thân thiện tại đơn vị quân đội. Nhiệm vụ của bạn là tiếp nhận các góp ý, thắc mắc về việc thăm quân nhân một cách lịch sự, nghiêm túc và đúng tác phong quân đội. Hãy trả lời ngắn gọn, chân thành và hứa sẽ ghi nhận ý kiến của người dân.",
      },
    });
    
    return response.text || "Cảm ơn bạn đã gửi góp ý.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Nếu lỗi do Key không tồn tại hoặc sai (404/403)
    return "Cảm ơn ý kiến đóng góp của bạn. Chúng tôi đã ghi nhận và sẽ phản hồi sớm nhất có thể.";
  }
};
