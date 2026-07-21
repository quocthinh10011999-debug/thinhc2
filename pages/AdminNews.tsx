import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Newspaper, Plus, Trash2, Sparkles, CheckCircle, Clock, 
  BookOpen, Eye, ListPlus, Send, ArrowRight, RefreshCw, AlertCircle
} from 'lucide-react';
import { generateMilitaryNewsDraft } from '../services/geminiService';

const AdminNews = () => {
  const { news, addNews, deleteNews, isLoading, lastSync } = useData();

  // State quản lý form thêm tin tức
  const [formData, setFormData] = useState({
    title: '',
    category: 'Huấn luyện',
    summary: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'
  });

  // State hỗ trợ soạn thảo AI
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [showAiSuggestInfo, setShowAiSuggestInfo] = useState(false);

  // State xem trước tin đang viết
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['Huấn luyện', 'Chính trị', 'Học tập', 'Hậu cần'];
  
  const presets = [
    { name: 'Thao trường huấn luyện', url: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sinh hoạt chính trị', url: 'https://images.unsplash.com/photo-1579913741617-3844a30a213a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Ban chính trị / Đại hội', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateAiDraft = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiDrafting(true);
    setShowAiSuggestInfo(false);
    try {
      const draft = await generateMilitaryNewsDraft(aiPrompt);
      if (draft && draft.title) {
        setFormData({
          title: draft.title,
          category: 'Chính trị',
          summary: draft.summary,
          content: draft.content,
          imageUrl: formData.imageUrl
        });
        setShowAiSuggestInfo(true);
        setAiPrompt('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề, tóm tắt và nội dung!");
      return;
    }

    try {
      await addNews(formData);
      // Reset form
      setFormData({
        title: '',
        category: 'Huấn luyện',
        summary: '',
        content: '',
        imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'
      });
      setShowPreview(false);
      setShowAiSuggestInfo(false);
      alert("Đã xuất bản tin tức chính thức thành công!");
    } catch (error) {
      console.error("Lỗi xuất bản tin tức:", error);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center">
            <Newspaper className="w-7 h-7 text-[#800000] mr-3" />
            Quản lý Bản tin Chiến sĩ
          </h1>
          <p className="text-xs text-slate-500 font-medium">Đồng bộ dữ liệu Neon Postgres: Cho phép tạo nhanh nội dung chính quy qua Trợ lý AI.</p>
        </div>
        <p className="text-xs text-slate-500 font-medium self-center">
          {isLoading ? (
            <span className="flex items-center"><RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin text-[#800000]" /> Đang tải Postgres...</span>
          ) : (
            <span>Đồng bộ: {lastSync?.toLocaleTimeString()}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM THÊM TIN TỨC (Lg: 7 Cột) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* AI Drafting Block */}
          <div className="bg-gradient-to-r from-[#800000] to-[#500000] text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-[#d4af37]">
              <Sparkles className="w-5 h-5 fill-[#d4af37] animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest">Trợ lý Biên soạn Quân sự AI</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-[11px] text-white/70 font-semibold leading-relaxed">
                Nhập nhanh chủ đề để AI tự động phác thảo bản tin thi đua lập công, kỷ cương hoặc sinh hoạt chính trị của đơn vị theo phong cách trang nghiêm.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: Đại hội Thể thao Đại đội 3, Nâng cao giờ tự học..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-grow px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/30 text-xs font-semibold rounded-lg focus:outline-none focus:border-[#d4af37] transition-all"
                />
                <button
                  onClick={handleGenerateAiDraft}
                  disabled={isAiDrafting || !aiPrompt.trim()}
                  className="bg-[#d4af37] text-[#800000] px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
                >
                  {isAiDrafting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-[#800000]" />
                      <span>AI Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {showAiSuggestInfo && (
              <div className="bg-green-950/40 p-4 border border-green-500/30 rounded-xl flex items-start space-x-2 text-xs">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black uppercase text-green-300">Đã nạp bản nháp AI!</p>
                  <p className="text-green-400/80 font-bold mt-0.5">Nội dung đề xuất đã điền vào form bên dưới. Bạn có thể kiểm tra và bấm "Phát hành bản tin".</p>
                </div>
              </div>
            )}
          </div>

          {/* Form Nhập Tin Tức */}
          <form onSubmit={handleSubmitNews} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center">
              <Plus className="w-4 h-4 mr-2 text-[#800000]" />
              Nhập thông tin bản tin mới
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tiêu đề bản tin</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Tiểu đoàn 15 dấy lên phong trào lập công..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:border-[#800000]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Thể loại</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-black uppercase text-slate-700 rounded-lg focus:outline-none focus:border-[#800000]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tóm tắt ngắn gọn</label>
              <input
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Nhập 1 câu tóm tắt nội dung chính để hiển thị bên ngoài danh sách..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:border-[#800000]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nội dung chi tiết</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                placeholder="Nhập nội dung đầy đủ của bản tin quân sự..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg focus:outline-none focus:border-[#800000] leading-relaxed"
              ></textarea>
            </div>

            {/* Chọn hình ảnh mẫu dã chiến */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Hình ảnh bản tin</label>
              
              <div className="grid grid-cols-3 gap-3">
                {presets.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: p.url }))}
                    className={`p-2 bg-slate-50 border rounded-lg flex flex-col items-center text-center space-y-2 transition-all ${
                      formData.imageUrl === p.url ? 'border-[#800000] bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={p.url} className="w-12 h-12 object-cover rounded" alt={p.name} />
                    <span className="text-[8px] font-bold uppercase text-slate-500">{p.name}</span>
                  </button>
                ))}
              </div>

              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Hoặc dán URL ảnh tùy chỉnh..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-[10px] font-mono rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-4 border border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Đóng Xem trước' : 'Xem trước'}</span>
              </button>

              <button
                type="submit"
                className="flex-grow bg-[#800000] text-[#d4af37] py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg text-center flex justify-center items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Phát hành bản tin chính thức</span>
              </button>
            </div>
          </form>

          {/* Khối Xem Trước (Preview Block) */}
          {showPreview && (
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-[#800000]/30 animate-subtle space-y-4">
              <p className="text-[10px] font-black text-[#800000] uppercase tracking-widest">--- XEM TRƯỚC BẢN TIN TRÊN TRANG CHỦ ---</p>
              
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm max-w-md mx-auto">
                <div className="h-44 relative bg-slate-900">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  <span className="absolute top-3 left-3 bg-[#800000] text-red-100 px-3 py-0.5 text-[8px] font-black uppercase tracking-widest rounded">
                    {formData.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-[8px] font-mono text-slate-400 uppercase">Đăng ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                  <h4 className="text-sm font-black text-slate-900 uppercase leading-snug">{formData.title || 'Tiêu đề bản tin'}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{formData.summary || 'Tóm tắt nội dung bản tin.'}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* DANH SÁCH BẢN TIN HIỆN CÓ (Lg: 5 Cột) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
              Danh sách bản tin đang phát hành ({news.length})
            </h3>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {news.length > 0 ? (
                news.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-4 hover:border-[#800000] transition-colors group">
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'} 
                      alt="Thumbnail"
                      className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200" 
                    />
                    <div className="flex-grow space-y-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[8px] font-black uppercase rounded">
                          {item.category}
                        </span>
                        
                        {/* Nút xóa */}
                        <button
                          onClick={() => {
                            if (confirm(`Bạn chắc chắn muốn xóa bản tin "${item.title}"?`)) {
                              deleteNews(item.id);
                            }
                          }}
                          className="text-slate-300 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <h4 className="text-[11px] font-black text-slate-900 uppercase truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 uppercase font-black text-[10px]">
                  Chưa có bản tin nào trong cơ sở dữ liệu
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminNews;
