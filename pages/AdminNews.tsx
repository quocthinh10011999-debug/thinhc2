import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Newspaper, Plus, Trash2, Sparkles, CheckCircle, Clock, 
  BookOpen, Eye, ListPlus, Send, ArrowRight, RefreshCw, AlertCircle,
  Settings, Image as ImageIcon, Link as LinkIcon, FileText, Heading, AlignLeft, Bold, Italic, Quote, List, ChevronDown, ChevronUp, Save, Layout, Globe
} from 'lucide-react';
import { generateMilitaryNewsDraft } from '../services/geminiService';

const AdminNews = () => {
  const { news, addNews, deleteNews, isLoading, lastSync } = useData();

  // Active view: 'editor' (WordPress composer) vs 'list' (Post list)
  const [activeTab, setActiveTab] = useState<'editor' | 'list'>('editor');

  // State quản lý form thêm tin tức
  const [formData, setFormData] = useState({
    title: '',
    category: 'Huấn luyện',
    summary: '',
    content: '',
    sourceUrl: ''
  });

  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'
  ]);

  // State hỗ trợ soạn thảo AI
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [showAiSuggestInfo, setShowAiSuggestInfo] = useState(false);

  // State xem trước tin đang viết
  const [showPreview, setShowPreview] = useState(false);

  // Sidebar widgets accordion states
  const [openWidgets, setOpenWidgets] = useState({
    publish: true,
    category: true,
    images: true,
    source: true,
    excerpt: true,
    aiAssistant: true
  });

  const toggleWidget = (name: keyof typeof openWidgets) => {
    setOpenWidgets(prev => ({ ...prev, [name]: !prev[name] }));
  };

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

  const handleAddPreset = (url: string) => {
    if (imageUrls.length === 1 && imageUrls[0] === 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800') {
      setImageUrls([url]);
    } else {
      setImageUrls(prev => [...prev, url]);
    }
  };

  const handleAddImageUrl = () => {
    setImageUrls(prev => [...prev, '']);
  };

  const handleUpdateImageUrl = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const handleRemoveImageUrl = (index: number) => {
    if (imageUrls.length <= 1) return;
    setImageUrls(prev => prev.filter((_, i) => i !== index));
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
          sourceUrl: formData.sourceUrl
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

    const filteredImages = imageUrls.map(url => url.trim()).filter(Boolean);
    if (filteredImages.length === 0) {
      alert("Vui lòng thêm ít nhất một hình ảnh!");
      return;
    }

    try {
      await addNews({
        ...formData,
        imageUrl: filteredImages.join(',')
      });
      // Reset form
      setFormData({
        title: '',
        category: 'Huấn luyện',
        summary: '',
        content: '',
        sourceUrl: ''
      });
      setImageUrls(['https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800']);
      setShowPreview(false);
      setShowAiSuggestInfo(false);
      alert("Đã xuất bản tin tức chính thức thành công lên WordPress CMS!");
    } catch (error) {
      console.error("Lỗi xuất bản tin tức:", error);
    }
  };

  // Helper formatting for simple Editor experience
  const insertTextAtCursor = (before: string, after: string = '') => {
    const textarea = document.getElementById('wp-main-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;
    
    setFormData(prev => ({
      ...prev,
      content: text.substring(0, start) + replacement + text.substring(end)
    }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* WordPress Sub-header navigation bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between shadow-lg gap-4 border-b-4 border-[#d4af37]">
        <div className="flex items-center space-x-3">
          <div className="bg-[#800000] p-2 rounded-lg text-white font-black text-xs tracking-wider flex items-center justify-center">
            WP
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-white flex items-center">
              TRÌNH BIÊN SOẠN CHUYÊN NGHIỆP WORDPRESS
              <span className="ml-2 px-1.5 py-0.5 bg-[#d4af37] text-[#800000] rounded text-[8px] font-bold">V6.2</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold">Hệ thống Quản trị Bản tin Chiến sĩ - Kết nối dữ liệu Neon Postgres</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'editor' 
                ? 'bg-[#800000] text-white shadow-md' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Viết Bài Mới</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'list' 
                ? 'bg-[#800000] text-white shadow-md' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Tất cả bài viết ({news.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <form onSubmit={handleSubmitNews} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: KHU VỰC SOẠN THẢO VĂN BẢN (GUTENBERG STYLE CANVAS) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* WordPress Document Top Bar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đang soạn bản nháp</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showPreview ? 'Đóng xem trước' : 'Xem trước'}</span>
                  </button>
                </div>
              </div>

              {/* Core Editor Canvas */}
              <div className="p-8 md:p-12 space-y-6">
                
                {/* Title Gutenberg-style Input */}
                <div className="space-y-1">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Thêm tiêu đề..."
                    className="w-full text-2xl md:text-3xl font-black bg-transparent border-b-2 border-transparent focus:border-[#800000] py-3 focus:outline-none text-slate-900 placeholder-slate-300 uppercase transition-all tracking-tight"
                    required
                  />
                  <div className="text-[9px] text-slate-400 font-mono">Đường dẫn: <span className="text-[#800000] font-bold">https://tieudoan15.vn/tin-tuc/{formData.title ? encodeURIComponent(formData.title.toLowerCase().replace(/ /g, '-')) : 'tieu-de-bai-viet'}</span></div>
                </div>

                {/* Excerpt Summary Area in main editor */}
                <div className="space-y-1 pt-2">
                  <input
                    type="text"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    placeholder="Nhập tóm tắt ngắn cho bài viết (Sẽ hiển thị dạng trích dẫn)..."
                    className="w-full text-xs font-semibold bg-slate-50 text-slate-600 placeholder-slate-400 border-l-4 border-[#800000] px-4 py-3 focus:outline-none focus:bg-red-50/30 transition-all rounded-r-lg"
                    required
                  />
                </div>

                {/* Rich-text Toolbar simulation */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('**', '**')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    title="Chữ đậm"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('*', '*')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    title="Chữ nghiêng"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('\n> ', '\n')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    title="Trích dẫn đặc biệt"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('\n- ', '')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    title="Danh sách gạch đầu dòng"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor('### ', '')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    title="Thẻ tiêu đề nhỏ"
                  >
                    <Heading className="w-4 h-4" />
                  </button>

                  <div className="w-px h-6 bg-slate-300 mx-2"></div>

                  <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest px-2">BÀI VIẾT QUÂN SỰ ĐỘC QUYỀN</span>
                </div>

                {/* Gutenberg Textarea Canvas */}
                <div className="space-y-2">
                  <textarea
                    id="wp-main-editor"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={14}
                    placeholder="Bắt đầu viết hoặc dán nội dung chi tiết bài viết chính quy tại đây..."
                    className="w-full text-sm font-medium bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed whitespace-pre-line min-h-[300px]"
                    required
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Số từ: {formData.content ? formData.content.split(/\s+/).filter(Boolean).length : 0} từ</span>
                  <span>Đồng bộ: Neon Postgres v15</span>
                </div>

              </div>
            </div>

            {/* PREVIEW BLOCK UNDERNEATH */}
            {showPreview && (
              <div className="bg-slate-50 p-6 rounded-2xl border-4 border-dashed border-[#800000]/20 animate-subtle space-y-4">
                <div className="flex items-center space-x-2 text-[#800000]">
                  <Eye className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Xem trước hiển thị giao diện người dùng</span>
                </div>
                
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl max-w-xl mx-auto">
                  <div className="h-56 relative bg-slate-900">
                    <img 
                      src={imageUrls[0] || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'} 
                      alt="Preview" 
                      className="w-full h-full object-cover opacity-85" 
                    />
                    <span className="absolute top-4 left-4 bg-[#800000] text-[#d4af37] px-3.5 py-1 text-[8px] font-black uppercase tracking-widest shadow-md">
                      {formData.category}
                    </span>
                    
                    {imageUrls.filter(Boolean).length > 1 && (
                      <span className="absolute bottom-4 right-4 bg-black/80 text-[#d4af37] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shadow-md">
                        <span>📷 {imageUrls.filter(Boolean).length} Ảnh</span>
                      </span>
                    )}
                  </div>

                  {imageUrls.filter(Boolean).length > 1 && (
                    <div className="p-3 bg-slate-50 flex gap-2 overflow-x-auto border-b border-slate-200">
                      {imageUrls.filter(Boolean).map((url, i) => (
                        <img key={i} src={url} className="w-12 h-9 object-cover rounded border border-slate-300 shrink-0" alt="" />
                      ))}
                    </div>
                  )}

                  <div className="p-8 space-y-4">
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Đăng ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                    <h4 className="text-xl font-black text-slate-900 uppercase leading-snug">{formData.title || 'Tiêu đề bài viết bản tin'}</h4>
                    <p className="text-xs font-black text-[#800000] bg-red-50 p-4 border-l-4 border-[#800000] leading-relaxed uppercase tracking-tight">{formData.summary || 'Tóm tắt bài viết sẽ hiển thị tại đây.'}</p>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium pt-2">
                      {formData.content || 'Nội dung chi tiết hiển thị tại đây.'}
                    </div>
                    {formData.sourceUrl && (
                      <div className="pt-3 text-[10px] font-black text-[#800000] uppercase tracking-wider flex items-center gap-1 border-t border-slate-100">
                        <span>🔗 Nguồn tham khảo ngoài: {formData.sourceUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* CỘT PHẢI: BAR THÔNG TIN BÀI VIẾT (WORDPRESS SIDEBAR STYLE) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* WIDGET 1: PUBLISH PANEL */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleWidget('publish')}
                className="w-full px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center hover:bg-slate-100 transition-colors"
              >
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-[#800000]" />
                  Đăng bài viết
                </span>
                {openWidgets.publish ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              {openWidgets.publish && (
                <div className="p-5 space-y-4">
                  <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Trạng thái:</span>
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Sẵn sàng phát hành</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Hiển thị:</span>
                      <span className="font-bold text-[#800000] flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> Công khai
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Đăng tải:</span>
                      <span className="font-bold">Ngay lập tức</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      type="submit"
                      className="flex-grow bg-[#800000] text-[#d4af37] py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Đăng bài chính thức</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* WIDGET 2: CHUYÊN MỤC (CATEGORIES) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleWidget('category')}
                className="w-full px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center hover:bg-slate-100 transition-colors"
              >
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#800000]" />
                  Chuyên mục (Thể loại)
                </span>
                {openWidgets.category ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openWidgets.category && (
                <div className="p-5 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Chọn chuyên mục phân loại bài viết chính:</p>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center space-x-2.5 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={formData.category === cat}
                          onChange={handleInputChange}
                          className="text-[#800000] focus:ring-[#800000]"
                        />
                        <span className={`text-xs font-black uppercase ${formData.category === cat ? 'text-[#800000]' : 'text-slate-600'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WIDGET 3: TRỢ LÝ QUÂN SỰ AI DỰ THẢO */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleWidget('aiAssistant')}
                className="w-full px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center hover:bg-slate-100 transition-colors"
              >
                <span className="text-[10px] font-black text-[#800000] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 fill-[#800000]" />
                  Trợ lý AI Quân Sự
                </span>
                {openWidgets.aiAssistant ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openWidgets.aiAssistant && (
                <div className="p-5 space-y-4 bg-gradient-to-br from-red-50/50 to-amber-50/20">
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                    Nhập chủ đề dã chiến để AI tự động phác thảo nhanh nội dung chính quy:
                  </p>

                  <div className="space-y-2">
                    <textarea
                      placeholder="Ví dụ: Đại đội 3 tăng gia sản xuất vượt chỉ tiêu, kỷ niệm ngày thành lập..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-white border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:border-[#800000] placeholder-slate-400"
                    ></textarea>

                    <button
                      type="button"
                      onClick={handleGenerateAiDraft}
                      disabled={isAiDrafting || !aiPrompt.trim()}
                      className="w-full bg-[#800000] text-[#d4af37] py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isAiDrafting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 fill-[#d4af37]" />
                          <span>Bắt đầu dự thảo AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {showAiSuggestInfo && (
                    <div className="bg-green-100 p-3 border border-green-200 rounded-lg flex items-start gap-1.5 text-[10px] font-medium text-green-800 animate-subtle">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Đã nạp văn bản dự thảo của AI vào khung soạn thảo chính bên trái thành công!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* WIDGET 4: HÌNH ẢNH & BỘ SƯU TẬP (GALLERY MEDIA) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleWidget('images')}
                className="w-full px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center hover:bg-slate-100 transition-colors"
              >
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#800000]" />
                  Bộ sưu tập ảnh ({imageUrls.length})
                </span>
                {openWidgets.images ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openWidgets.images && (
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Danh sách ảnh trượt:</span>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm ảnh</span>
                    </button>
                  </div>

                  {/* Click preset to add */}
                  <div className="space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Thêm nhanh ảnh dã chiến mẫu:</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {presets.map((p, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleAddPreset(p.url)}
                          className="p-1 bg-white border border-slate-200 rounded flex flex-col items-center text-center hover:border-[#800000] transition-all"
                        >
                          <img src={p.url} className="w-8 h-8 object-cover rounded" alt="" />
                          <span className="text-[6px] font-black uppercase text-slate-500 scale-90 truncate w-full mt-1">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Inputs list */}
                  <div className="space-y-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-1.5 items-center bg-slate-50 p-1.5 border border-slate-200 rounded-lg">
                        <span className="text-[8px] font-black text-slate-400 w-4 text-center">#{index + 1}</span>
                        
                        {url && (
                          <img 
                            src={url} 
                            className="w-6 h-6 object-cover rounded shrink-0 border border-slate-300" 
                            onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800"; }} 
                            alt="" 
                          />
                        )}
                        
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => handleUpdateImageUrl(index, e.target.value)}
                          placeholder="Dán URL ảnh..."
                          className="flex-grow px-2 py-1 bg-white border border-slate-200 text-[8px] font-mono rounded focus:outline-none focus:border-[#800000]"
                        />

                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(index)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WIDGET 5: SOURCE LINK (ĐƯỜNG DẪN LIÊN KẾT NGOÀI) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleWidget('source')}
                className="w-full px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center hover:bg-slate-100 transition-colors"
              >
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-[#800000]" />
                  Đường dẫn liên kết ngoài
                </span>
                {openWidgets.source ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openWidgets.source && (
                <div className="p-5 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Liên kết nguồn hoặc Video tham khảo (nếu có):</p>
                  <input
                    type="text"
                    name="sourceUrl"
                    value={formData.sourceUrl || ''}
                    onChange={handleInputChange}
                    placeholder="https://qdnd.vn/tin-tuc-quan-doi..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:border-[#800000]"
                  />
                </div>
              )}
            </div>

          </div>

        </form>
      ) : (
        
        /* POST MANAGER TABLE / DIRECTORY (TẤT CẢ BÀI VIẾT - WORDPRESS TABLES STYLE) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          
          {/* WordPress Action Header */}
          <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Layout className="w-4 h-4 text-[#800000]" />
                Bài viết ({news.length})
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hệ thống quản lý tin bài phân luồng của WordPress dã chiến</p>
            </div>
            
            <button
              onClick={() => setActiveTab('editor')}
              className="bg-[#800000] text-[#d4af37] px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-black transition-all shadow-md shadow-[#800000]/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Viết bài mới</span>
            </button>
          </div>

          {/* Table Operations bar */}
          <div className="px-6 py-2.5 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-slate-500">
            <div className="flex items-center space-x-3">
              <span className="text-slate-800">Tất cả ({news.length})</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#800000] cursor-pointer hover:underline">Đã xuất bản ({news.length})</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 cursor-not-allowed">Bản nháp (0)</span>
            </div>
            <div className="text-[9px] font-mono uppercase tracking-tight text-slate-400">
              Cơ sở dữ liệu: Postgres Neon
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6 w-12 text-center">
                    <input type="checkbox" className="rounded text-[#800000] focus:ring-[#800000] w-3.5 h-3.5" defaultChecked />
                  </th>
                  <th className="py-4 px-4 min-w-[280px]">Tiêu đề bài viết</th>
                  <th className="py-4 px-4 w-32">Tác giả</th>
                  <th className="py-4 px-4 w-40">Chuyên mục</th>
                  <th className="py-4 px-4 w-44">Thời gian đăng</th>
                  <th className="py-4 px-4 w-28 text-center">Liên kết ngoài</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {news.length > 0 ? (
                  news.map((item) => {
                    const itemImages = item.imageUrl ? item.imageUrl.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
                    return (
                      <tr key={item.id} className="hover:bg-red-50/20 transition-all group">
                        {/* Checkbox column */}
                        <td className="py-5 px-6 text-center">
                          <input type="checkbox" className="rounded text-[#800000] focus:ring-[#800000] w-3.5 h-3.5" />
                        </td>

                        {/* Title & Hover actions column */}
                        <td className="py-5 px-4 space-y-1">
                          <div className="flex items-center gap-3">
                            <img 
                              src={itemImages[0] || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'} 
                              alt="" 
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0 shadow-sm"
                            />
                            <div>
                              <span className="font-extrabold text-slate-900 group-hover:text-[#800000] transition-colors uppercase leading-snug tracking-tight text-xs block">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5 max-w-lg">
                                {item.summary}
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions Panel on Hover (Like WordPress) */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest pt-1.5 pl-12 text-slate-400">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  title: item.title,
                                  category: item.category,
                                  summary: item.summary,
                                  content: item.content,
                                  sourceUrl: item.sourceUrl || ''
                                });
                                if (item.imageUrl) {
                                  setImageUrls(item.imageUrl.split(',').map(u => u.trim()));
                                }
                                setActiveTab('editor');
                              }}
                              className="text-slate-600 hover:text-[#800000] transition-colors"
                            >
                              Sửa đổi
                            </button>
                            <span>|</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Bạn chắc chắn muốn xóa bài viết "${item.title}"?`)) {
                                  deleteNews(item.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              Thùng rác
                            </button>
                            <span>|</span>
                            <a
                              href={`/news?newsId=${item.id}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              Xem bài viết
                            </a>
                          </div>
                        </td>

                        {/* Author column */}
                        <td className="py-5 px-4 text-slate-500 uppercase tracking-tight text-[10px] font-black">
                          Ban Biên Tập
                        </td>

                        {/* Category column */}
                        <td className="py-5 px-4">
                          <span className="px-2.5 py-1 bg-red-50 border border-red-100 text-[#800000] text-[9px] font-black uppercase rounded-md tracking-wider">
                            {item.category}
                          </span>
                        </td>

                        {/* Date column */}
                        <td className="py-5 px-4 space-y-0.5 text-slate-500 text-[10px] font-bold">
                          <div className="text-slate-800">Đã xuất bản</div>
                          <div className="font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : 'Đang cập nhật'}</div>
                        </td>

                        {/* External link column */}
                        <td className="py-5 px-4 text-center">
                          {item.sourceUrl ? (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex p-1.5 bg-slate-100 hover:bg-[#800000] hover:text-white rounded-lg text-slate-500 transition-all"
                              title={item.sourceUrl}
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-slate-300 font-bold">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-24 text-slate-400 uppercase font-black text-[10px] tracking-widest border-2 border-dashed border-slate-100 rounded-b-2xl bg-slate-50">
                      Chưa có bản tin nào trong cơ sở dữ liệu Postgres
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* WordPress Footer bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
            <span>Hiển thị {news.length} bài viết</span>
            <span>Trang 1 trên 1</span>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminNews;

