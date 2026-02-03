
import React, { useState } from 'react';
import { MessageSquare, Send, User, ShieldCheck, Loader2, ChevronRight, HelpCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useData } from '../context/DataContext';

const FeedbackPage = () => {
  const { feedbacks, refreshData, isLoading: isDataLoading } = useData();
  const [newFeedback, setNewFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Chuẩn bị dữ liệu góp ý (Không sử dụng AI phản hồi tự động)
      const feedbackData = {
        author: 'Người dân (Ẩn danh)',
        content: newFeedback,
        date: new Date().toLocaleDateString('vi-VN'),
        response: 'Trực ban tiểu đoàn đã tiếp nhận nội dung góp ý của quý vị. Ý kiến này đã được chuyển tới Ban chỉ huy để xem xét và giải quyết trong thời gian sớm nhất.',
        status: 'received'
      };

      // Ghi vào Database
      await api.createFeedback(feedbackData);
      
      // Làm mới dữ liệu
      await refreshData();
      
      setNewFeedback('');
      alert("Gửi góp ý thành công. Trực ban đơn vị đã ghi nhận ý kiến của bạn.");
    } catch (error) {
      console.error("Lỗi khi gửi góp ý:", error);
      alert("Hệ thống hiện đang bận, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
            <h1 className="text-4xl font-black text-[#0f172a] uppercase tracking-tighter">Hòm thư <span className="text-[#800000]">Điện tử</span></h1>
            <div className="flex items-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
            <span className="hover:text-[#0f172a] cursor-pointer transition-colors">Trang chủ</span>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-[#0f172a]">Góp ý & Kiến nghị</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
                <div className="bg-white p-10 shadow-xl border border-slate-100 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#800000]/5 rounded-bl-full"></div>
                    <h2 className="text-lg font-black mb-8 flex items-center text-[#0f172a] uppercase tracking-tight relative z-10">
                      <MessageSquare className="w-6 h-6 mr-4 text-[#800000]" /> Nội dung kiến nghị
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <textarea
                        className="w-full px-6 py-5 text-sm border border-slate-200 focus:border-[#800000] focus:ring-4 focus:ring-red-50 outline-none min-h-[180px] transition-all bg-slate-50 text-slate-900 font-medium rounded-xl"
                        placeholder="Nhập nội dung đóng góp, thắc mắc hoặc kiến nghị của thân nhân tại đây..."
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                    ></textarea>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <ShieldCheck className="w-4 h-4" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Kênh thông tin được bảo mật</p>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || !newFeedback.trim()}
                          className="w-full md:w-auto bg-[#800000] text-[#d4af37] px-12 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3 rounded-full"
                        >
                          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                          <span>{isSubmitting ? 'ĐANG GỬI...' : 'GỬI TRỰC BAN TIỂU ĐOÀN'}</span>
                        </button>
                    </div>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Clock className="w-4 h-4 mr-2" /> Phản hồi gần đây
                      </h3>
                      {isDataLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                    </div>
                    
                    {feedbacks.length === 0 ? (
                      <div className="bg-white p-12 text-center border border-dashed border-slate-200 rounded-2xl">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Chưa có ý kiến đóng góp nào</p>
                      </div>
                    ) : (
                      feedbacks.map((f) => (
                        <div key={f.id} className="bg-white p-8 border border-slate-100 shadow-sm space-y-6 animate-subtle rounded-2xl">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-[#800000] rounded-full">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase">{f.author}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{f.date}</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">Đã tiếp nhận</span>
                            </div>
                            <p className="text-sm text-slate-600 italic leading-loose px-4 border-l-2 border-slate-100">"{f.content}"</p>
                            {f.response && (
                            <div className="bg-slate-50 p-8 border-l-4 border-[#800000] rounded-r-2xl">
                                <div className="flex items-start space-x-4">
                                <ShieldCheck className="w-5 h-5 text-[#800000] mt-1 shrink-0" />
                                <div className="text-sm text-[#800000] leading-loose font-medium">
                                    <span className="font-black uppercase text-[10px] block mb-2">Trực ban đơn vị phản hồi:</span>
                                    <p className="whitespace-pre-line text-slate-700">{f.response}</p>
                                </div>
                                </div>
                            </div>
                            )}
                        </div>
                      ))
                    )}
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="bg-[#0f172a] p-10 text-white shadow-2xl space-y-10 sticky top-24 rounded-3xl">
                    <HelpCircle className="w-12 h-12 text-[#d4af37]" />
                    <h4 className="font-black text-[#d4af37] text-sm uppercase tracking-widest">Thông tin hỗ trợ</h4>
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Điện thoại trực ban:</p>
                            <p className="text-xl font-black tracking-tight">024.3333.xxxx</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-[10px] text-[#d4af37] font-bold uppercase mb-3 flex items-center">
                              <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Cam kết an ninh:
                            </p>
                            <p className="text-[11px] font-medium leading-relaxed text-slate-400 italic">Mọi ý kiến của thân nhân sẽ được Trực ban ghi nhận và báo cáo trực tiếp tới Ban chỉ huy Tiểu đoàn để xử lý khách quan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
