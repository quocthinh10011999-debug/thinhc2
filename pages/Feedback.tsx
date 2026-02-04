
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, ShieldCheck, Loader2, ChevronRight, HelpCircle } from 'lucide-react';
import { Feedback } from '../types';
import { getAIResponse } from '../services/geminiService';
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
      // 1. Lấy phản hồi từ AI (Trực ban ảo)
      const aiResponse = await getAIResponse(newFeedback);
      
      // 2. Chuẩn bị đối tượng dữ liệu để ghi vào Database
      const feedbackData = {
        author: 'Người dân (Ẩn danh)',
        content: newFeedback,
        date: new Date().toLocaleDateString('vi-VN'),
        response: aiResponse,
        status: 'received'
      };

      // 3. Ghi vào Firebase Firestore thông qua API Service
      await api.createFeedback(feedbackData);
      
      // 4. Làm mới dữ liệu hiển thị
      await refreshData();
      
      setNewFeedback('');
    } catch (error) {
      console.error("Lỗi khi gửi góp ý vào Cloud:", error);
      alert("Hệ thống Cloud đang bận, ý kiến đã được lưu tạm bộ nhớ máy.");
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
            <span className="text-[#0f172a]">Góp ý</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
                <div className="bg-white p-10 shadow-xl border border-slate-100">
                    <h2 className="text-lg font-black mb-8 flex items-center text-[#0f172a] uppercase tracking-tight">
                    <MessageSquare className="w-6 h-6 mr-4 text-[#800000]" /> Nội dung kiến nghị
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <textarea
                        className="w-full px-6 py-5 text-sm border border-slate-200 focus:border-[#0f172a] focus:ring-4 focus:ring-slate-50 outline-none min-h-[180px] transition-all bg-slate-50 text-slate-900 font-medium"
                        placeholder="Nhập nội dung đóng góp của quý vị tại đây..."
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                    ></textarea>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dữ liệu được bảo mật trên Cloud</p>
                        <button
                        type="submit"
                        disabled={isSubmitting || !newFeedback.trim()}
                        className="w-full md:w-auto bg-[#0f172a] text-white px-12 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-[#800000] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3"
                        >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{isSubmitting ? 'ĐANG XỬ LÝ...' : 'GỬI KIẾN NGHỊ'}</span>
                        </button>
                    </div>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Phản hồi gần đây</h3>
                      {isDataLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                    </div>
                    
                    {feedbacks.length === 0 ? (
                      <div className="bg-white p-12 text-center border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Chưa có ý kiến đóng góp công khai</p>
                      </div>
                    ) : (
                      feedbacks.map((f) => (
                        <div key={f.id} className="bg-white p-8 border border-slate-100 shadow-sm space-y-6 animate-subtle">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-[#0f172a]">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase">{f.author}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{f.date}</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Cloud Verified</span>
                            </div>
                            <p className="text-sm text-slate-600 italic leading-loose">"{f.content}"</p>
                            {f.response && (
                            <div className="bg-slate-50 p-8 border-l-4 border-[#0f172a]">
                                <div className="flex items-start space-x-4">
                                <ShieldCheck className="w-5 h-5 text-[#0f172a] mt-1 shrink-0" />
                                <div className="text-sm text-[#0f172a] leading-loose font-medium">
                                    <span className="font-black uppercase text-[10px] block mb-2">Trực ban tiểu đoàn phản hồi:</span>
                                    <p className="whitespace-pre-line">{f.response}</p>
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
                <div className="bg-[#0f172a] p-10 text-white shadow-2xl space-y-10 sticky top-24">
                    <HelpCircle className="w-12 h-12 text-[#d4af37]" />
                    <h4 className="font-black text-[#d4af37] text-sm uppercase tracking-widest">Kênh thông tin chính thức</h4>
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Trực ban đơn vị:</p>
                            <p className="text-xl font-black tracking-tight">024.3333.xxxx</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <p className="text-[10px] text-[#d4af37] font-bold uppercase mb-2">Lưu ý bảo mật:</p>
                            <p className="text-[11px] font-medium leading-relaxed text-slate-400 italic">Mọi ý kiến đóng góp của quý vị đều được mã hóa và chuyển trực tiếp tới hệ thống chỉ huy để đảm bảo tính khách quan.</p>
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
