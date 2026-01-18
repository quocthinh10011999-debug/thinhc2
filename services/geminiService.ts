
import { GoogleGenAI } from "@google/genai";

/**
 * Sử dụng Gemini API để tạo phản hồi tự động cho ý kiến đóng góp.
 * Tận dụng model gemini-3-flash-preview để có hiệu năng và chất lượng tốt nhất.
 */
export const getAIResponse = async (feedback: string) => {
  try {
    // Khởi tạo client Gemini với API key từ biến môi trường
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Gọi API để tạo phản hồi dựa trên nội dung góp ý
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: feedback,
      config: {
        systemInstruction: "Bạn là trợ lý ảo chuyên nghiệp của Tiểu đoàn 15 SPG-9. Hãy đưa ra phản hồi lịch sự, đúng tác phong quân đội (nghiêm túc nhưng cầu thị) cho ý kiến đóng góp của thân nhân chiến sĩ. Phản hồi cần ngắn gọn, thể hiện sự ghi nhận và cam kết bảo mật thông tin.",
      }
    });
    
    // Trả về văn bản từ phản hồi của model
    return response.text || "Cảm ơn ý kiến đóng góp của bạn. Chúng tôi đã ghi nhận thông tin.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Phản hồi dự phòng khi API gặp lỗi
    return "Cảm ơn ý kiến đóng góp của bạn. Trực ban tiểu đoàn đã tiếp nhận thông tin và sẽ xem xét xử lý trong thời gian sớm nhất theo đúng quy định.";
  }
};
