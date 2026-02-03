
import React, { useState } from 'react';
import { MessageSquare, Send, User, ShieldCheck, Loader2, ChevronRight, HelpCircle, Clock, ShieldAlert, CheckCircle, Phone } from 'lucide-react';
import { api } from '../services/api';
import { useData } from '../context/DataContext';

const FeedbackPage = () => {
  const { refreshData } = useData();
  const [newFeedback, setNewFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        author: 'Người dân (Ẩn danh)',
        content: newFeedback,
        date: new Date().toLocaleDateString('vi-VN'),
        response: '',
        status: 'pending'
      };

      await api.createFeedback(feedbackData);
      await refreshData();
      
      setNewFeedback('');
      setIsSuccess(true);
      // Quay lại trạng thái ban đầu sau 5 giây
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Lỗi khi gửi góp ý:", error);
      alert("Hệ thống hiện đang bận, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl font-black text-[#0f172a] uppercase tracking-tighter">Hòm thư <span className="text-[#800000]">Góp ý Bảo mật</span></h1>
            <div className="flex items-center justify-center md:justify-start text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
              <span className="hover:text-[#0f172a] cursor-pointer transition-colors">Trang chủ</span>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-[#0f172a]">Gửi kiến nghị trực tiếp</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
                {isSuccess ? (
                  <div className="bg-white p-12 shadow-xl border-t-8 border-green-500 rounded-2xl text-center space-y-6 animate-subtle">
                      <div className="w-20 h-20 bg-green-50 text-green-500 flex items-center justify-center mx-auto rounded-full">
                        <CheckCircle className="w-12 h-12" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 uppercase">Gửi thành công</h2>
                        <p className="text-sm text-slate-500 font-medium">Ý kiến của quý vị đã được mã hóa và chuyển thẳng tới hòm thư của Ban chỉ huy Tiểu đoàn.</p>
                      </div>
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="text-[10px] font-black text-[#800000] uppercase tracking-widest hover:underline"
                      >
                        Tiếp tục gửi ý kiến khác
                      </button>
                  </div>
                ) : (
                  <div className="bg-white p-10 shadow-xl border border-slate-100 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#800000]/5 rounded-bl-full"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-4 mb-8">
                          <div className="p-3 bg-[#800000] rounded-xl text-[#d4af37]">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-tight">
                            Nội dung kiến nghị
                          </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 rounded-r-lg mb-6 flex items-start space-x-3">
                            <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5" />
                            <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                              Đây là kênh thông tin khép kín. Nội dung bạn gửi sẽ CHỈ được xem bởi Chỉ huy đơn vị và không hiển thị công khai trên website.
                            </p>
                          </div>

                          <textarea
                              required
                              className="w-full px-6 py-5 text-sm border border-slate-200 focus:border-[#800000] focus:ring-4 focus:ring-red-50 outline-none min-h-[220px] transition-all bg-slate-50 text-slate-900 font-medium rounded-xl"
                              placeholder="Quý thân nhân vui lòng nhập nội dung phản ánh, góp ý về công tác tiếp đón, quản lý hoặc các vấn đề liên quan tại đây..."
                              value={newFeedback}
                              onChange={(e) => setNewFeedback(e.target.value)}
                          ></textarea>
                          
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                              <div className="flex items-center space-x-2 text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Bảo mật thông tin 100%</p>
                              </div>
                              <button
                                type="submit"
                                disabled={isSubmitting || !newFeedback.trim()}
                                className="w-full md:w-auto bg-[#800000] text-[#d4af37] px-12 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3 rounded-full"
                              >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>{isSubmitting ? 'ĐANG XỬ LÝ...' : 'GỬI ĐẾN BAN CHỈ HUY'}</span>
                              </button>
                          </div>
                        </form>
                      </div>
                  </div>
                )}
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-[#0f172a] p-10 text-white shadow-2xl space-y-10 rounded-3xl">
                    <HelpCircle className="w-12 h-12 text-[#d4af37]" />
                    <h4 className="font-black text-[#d4af37] text-sm uppercase tracking-widest">Quy trình xử lý</h4>
                    <div className="space-y-8">
                        <div className="flex items-start space-x-4">
                          <div className="w-6 h-6 bg-[#800000] rounded-full flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                          <p className="text-[11px] font-medium leading-relaxed text-slate-400">Tiếp nhận thông tin qua cổng bảo mật PostgreSQL.</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-6 h-6 bg-[#800000] rounded-full flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                          <p className="text-[11px] font-medium leading-relaxed text-slate-400">Trực ban tổng hợp và báo cáo Chỉ huy Tiểu đoàn trong phiên giao ban gần nhất.</p>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-6 h-6 bg-[#800000] rounded-full flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                          <p className="text-[11px] font-medium leading-relaxed text-slate-400">Thực hiện các biện pháp kiểm tra, chấn chỉnh và xử lý khách quan.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 border border-slate-100 rounded-2xl shadow-sm space-y-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hỗ trợ khẩn cấp</p>
                    <div className="flex items-center space-x-3 text-[#800000]">
                      {/* Fixed: Imported and used Phone icon from lucide-react */}
                      <Phone className="w-4 h-4" />
                      <span className="text-lg font-black tracking-tight">024.3333.xxxx</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
