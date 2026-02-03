
import React, { useState } from 'react';
import { 
  MessageSquare, Search, Trash2, Reply, 
  Send, X, Loader2, ShieldCheck, Zap, 
  CheckCircle2, Clock, Filter, BrainCircuit
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { getAIResponse } from '../services/geminiService';

const AdminFeedback = () => {
  const { feedbacks, updateFeedback, deleteFeedback, isLoading, lastSync } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredFeedbacks = feedbacks.filter(f => 
    f.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenReply = (feedback: any) => {
    setReplyingTo(feedback);
    setReplyContent(feedback.response || '');
  };

  const handleGenerateAI = async () => {
    if (!replyingTo) return;
    setIsGeneratingAI(true);
    try {
      const aiResponse = await getAIResponse(replyingTo.content);
      setReplyContent(aiResponse);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveReply = async () => {
    if (!replyingTo) return;
    setIsSaving(true);
    try {
      await updateFeedback(replyingTo.id, {
        response: replyContent,
        status: 'responded'
      });
      setReplyingTo(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hòm thư Góp ý</h1>
          <p className="text-xs text-slate-500 font-medium">Quản lý và phản hồi ý kiến từ thân nhân chiến sĩ.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm nội dung góp ý..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#800000] w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredFeedbacks.length > 0 ? filteredFeedbacks.map((f) => (
          <div key={f.id} className="bg-white border-2 border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-xs ${f.status === 'responded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {f.status === 'responded' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">{f.author}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{f.date}</p>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenReply(f)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Phản hồi">
                  <Reply className="w-4 h-4" />
                </button>
                <button onClick={() => deleteFeedback(f.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Xóa">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="pl-16 space-y-4">
              <p className="text-sm text-slate-600 font-medium italic leading-relaxed border-l-2 border-slate-100 pl-4">"{f.content}"</p>
              
              {f.response ? (
                <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-[#800000] space-y-2">
                  <div className="flex items-center text-[10px] font-black text-[#800000] uppercase tracking-widest mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Trực ban đơn vị phản hồi:
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{f.response}</p>
                </div>
              ) : (
                <button 
                  onClick={() => handleOpenReply(f)}
                  className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center hover:underline"
                >
                  <Reply className="w-3 h-3 mr-2" /> Soạn thảo phản hồi ngay
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Chưa có ý kiến góp ý nào được ghi nhận</p>
          </div>
        )}
      </div>

      {replyingTo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl shadow-2xl border-t-[12px] border-[#800000] rounded-3xl overflow-hidden animate-subtle">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-[#800000] uppercase text-sm tracking-tight flex items-center">
                <Reply className="w-5 h-5 mr-3" /> Phản hồi góp ý quân sự
              </h3>
              <button onClick={() => setReplyingTo(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nội dung góp ý của {replyingTo.author}:</p>
                <p className="text-xs text-slate-600 italic">"{replyingTo.content}"</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nội dung phản hồi (Văn bản chính quy)</label>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="flex items-center space-x-2 text-[9px] font-black uppercase text-[#800000] bg-[#d4af37]/20 px-3 py-1.5 rounded-lg hover:bg-[#d4af37] transition-all"
                  >
                    {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                    <span>{isGeneratingAI ? 'Đang soạn thảo...' : 'Gemini AI Gợi ý'}</span>
                  </button>
                </div>
                <textarea 
                  value={replyContent} 
                  onChange={(e) => setReplyContent(e.target.value)} 
                  placeholder="Nhập nội dung phản hồi của sĩ quan trực ban..."
                  className="w-full h-40 px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-medium rounded-2xl transition-all"
                />
              </div>

              <div className="flex space-x-4">
                <button onClick={() => setReplyingTo(null)} className="flex-1 px-8 py-4 border-2 border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">Hủy</button>
                <button 
                  onClick={handleSaveReply}
                  disabled={isSaving || !replyContent.trim()}
                  className="flex-[2] bg-[#800000] text-[#d4af37] py-4 font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-black transition-all rounded-xl shadow-xl disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isSaving ? 'ĐANG LƯU...' : 'XÁC NHẬN PHẢN HỒI'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
