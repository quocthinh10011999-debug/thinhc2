
import { GoogleGenAI } from "@google/genai";

/**
 * Sử dụng Gemini API để tạo phản hồi tự động cho ý kiến đóng góp.
 * Vai trò: Trực ban tiểu đoàn 15.
 */
export const getAIResponse = async (feedback: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: feedback,
      config: {
        systemInstruction: "Bạn là Sĩ quan Trực ban của Tiểu đoàn 15. Nhiệm vụ của bạn là tiếp nhận và phản hồi các ý kiến đóng góp của thân nhân chiến sĩ qua hòm thư điện tử. Hãy phản hồi bằng tiếng Việt, tác phong quân đội nghiêm túc, lịch sự, ngắn gọn. Luôn bắt đầu bằng việc ghi nhận ý kiến và kết thúc bằng việc cam kết báo cáo lên Chỉ huy đơn vị nếu cần thiết. Danh xưng: 'Trực ban tiểu đoàn'.",
      }
    });
    
    return response.text || "Trực ban tiểu đoàn đã tiếp nhận ý kiến của quý vị. Xin cảm ơn.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Trực ban tiểu đoàn đã tiếp nhận thông tin và sẽ kiểm tra đối soát trong thời gian sớm nhất.";
  }
};
