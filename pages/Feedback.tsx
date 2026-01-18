
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, ShieldCheck, Loader2, ChevronRight, HelpCircle } from 'lucide-react';
import { Feedback } from '../types';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('vms_feedbacks') || '[]');
    // Nếu chưa có feedback nào, thêm 1 cái mặc định
    if (saved.length === 0) {
      const defaultFB = {
        id: '1',
        author: 'Thân nhân chiến sĩ',
        content: 'Cổng đăng ký trực tuyến rất thuận tiện cho gia đình.',
        date: '10/11/2024',
        response: 'Cảm ơn ý kiến của quý vị. Đơn vị luôn nỗ lực cải thiện trải nghiệm cho người dân.'
      };
      setFeedbacks([defaultFB]);
      localStorage.setItem('vms_feedbacks', JSON.stringify([defaultFB]));
    } else {
      setFeedbacks(saved);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    setIsSubmitting(true);
    
    // Thay thế AI bằng phản hồi tĩnh
    const staticResponse = "Cảm ơn ý kiến đóng góp của bạn. Ban Chỉ huy đơn vị đã tiếp nhận thông tin và sẽ xem xét xử lý trong thời gian sớm nhất theo đúng quy định.";
    
    // Giả lập một chút độ trễ để tạo cảm giác xử lý
    setTimeout(() => {
      const feedback: Feedback = {
        id: Date.now().toString(),
        author: 'Người dân (Ẩn danh)',
        content: newFeedback,
        date: new Date().toLocaleDateString('vi-VN'),
        response: staticResponse
      };

      const updated = [feedback, ...feedbacks];
      setFeedbacks(updated);
      localStorage.setItem('vms_feedbacks', JSON.stringify(updated));
      setNewFeedback('');
      setIsSubmitting(false);
    }, 500);
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mọi thông tin sẽ được bảo mật</p>
                        <button
                        type="submit"
                        disabled={isSubmitting || !newFeedback.trim()}
                        className="w-full md:w-auto bg-[#0f172a] text-white px-12 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-[#800000] transition-all shadow-xl disabled:opacity-50"
                        >
                        {isSubmitting ? 'ĐANG XỬ LÝ...' : 'GỬI KIẾN NGHỊ'}
                        </button>
                    </div>
                    </form>
                </div>

                <div className="space-y-8">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Phản hồi gần đây</h3>
                    {feedbacks.map((f) => (
                    <div key={f.id} className="bg-white p-8 border border-slate-100 shadow-sm space-y-6">
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
                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Đã tiếp nhận</span>
                        </div>
                        <p className="text-sm text-slate-600 italic leading-loose">"{f.content}"</p>
                        {f.response && (
                        <div className="bg-slate-50 p-8 border-l-4 border-[#0f172a]">
                            <div className="flex items-start space-x-4">
                            <ShieldCheck className="w-5 h-5 text-[#0f172a] mt-1 shrink-0" />
                            <p className="text-sm text-[#0f172a] leading-loose font-medium">
                                <span className="font-black uppercase text-[10px] block mb-2">Ban chỉ huy phản hồi:</span>
                                {f.response}
                            </p>
                            </div>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="bg-[#0f172a] p-10 text-white shadow-2xl space-y-10">
                    <HelpCircle className="w-12 h-12 text-[#d4af37]" />
                    <h4 className="font-black text-[#d4af37] text-sm uppercase tracking-widest">Hỗ trợ khẩn cấp</h4>
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Số trực ban:</p>
                            <p className="text-xl font-black tracking-tight">024.3333.xxxx</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Thời gian tiếp nhận:</p>
                            <p className="text-xs font-bold leading-relaxed text-slate-300 italic">24/7 đối với các trường hợp khẩn cấp liên quan đến quân nhân.</p>
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
