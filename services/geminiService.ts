
import { GoogleGenAI } from "@google/genai";

/**
 * Sử dụng Gemini API để tạo phản hồi tự động cho ý kiến đóng góp.
 */
export const getAIResponse = async (feedback: string) => {
  try {
    const key = (import.meta.env?.VITE_API_KEY as string) || (process.env?.API_KEY as string) || "";
    const ai = new GoogleGenAI({ apiKey: key });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

/**
 * Trợ lý ảo biên soạn bản tin thi đua chính trị của Tiểu đoàn 15
 */
export const generateMilitaryNewsDraft = async (topic: string) => {
  try {
    const key = (import.meta.env?.VITE_API_KEY as string) || (process.env?.API_KEY as string) || "";
    const ai = new GoogleGenAI({ apiKey: key });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Hãy biên soạn một bản tin chính trị quân sự ngắn gọn bằng tiếng Việt về chủ đề: "${topic}". 
Bản tin cần có cấu trúc:
1. TIÊU ĐỀ: (Viết hoa, trang trọng, lôi cuốn)
2. TÓM TẮT: (Một câu tóm tắt nội dung chính)
3. NỘI DUNG: (Một đoạn văn phân tích chi tiết, tác phong quân đội trang nghiêm, kỷ cương, chính trị vững vàng, động viên tinh thần chiến sĩ).
Hãy phản hồi dưới dạng JSON thuần túy theo cấu trúc:
{
  "title": "TIÊU ĐỀ",
  "summary": "TÓM TẮT",
  "content": "NỘI DUNG CHI TIẾT"
}
Không để bất kỳ ký tự Markdown nào bên ngoài khối JSON.`,
      config: {
        systemInstruction: "Bạn là Trợ lý Ban Chính trị của Tiểu đoàn 15. Nhiệm vụ của bạn là biên soạn các bản tin, tuyên truyền hoạt động, huấn luyện, thi đua quyết thắng của đơn vị. Giọng điệu trang nghiêm, hào hùng, đậm chất chính quy quân đội nhân dân Việt Nam.",
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini News Generator Error:", error);
    return {
      title: `BẢN TIN HOẠT ĐỘNG: ${topic.toUpperCase()}`,
      summary: `Đơn vị triển khai hoạt động về chủ đề ${topic} đạt kết quả tốt đẹp.`,
      content: `Tiểu đoàn 15 đã triển khai đồng bộ các biện pháp, nâng cao ý thức trách nhiệm của cán bộ, chiến sĩ đối với nhiệm vụ ${topic}. Toàn đơn vị giữ vững kỷ luật, đoàn kết một lòng, quyết tâm hoàn thành xuất sắc mọi nhiệm vụ được giao.`
    };
  }
};

