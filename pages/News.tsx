import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Newspaper, Clock, Search, ChevronRight, X, Info, Send, CheckCircle } from 'lucide-react';

const News = () => {
  const { news } = useData();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNewsDetail, setActiveNewsDetail] = useState<any | null>(null);
  
  // Quick comment states
  const [quickComment, setQuickComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const categories = ['Tất cả', 'Huấn luyện', 'Chính trị', 'Học tập', 'Hậu cần'];

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickComment.trim()) return;
    setCommentSubmitted(true);
    setQuickComment('');
    setTimeout(() => {
      setCommentSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header Banner */}
      <div className="relative py-16 bg-[#800000] text-white rounded-3xl overflow-hidden shadow-xl border-l-8 border-[#d4af37]">
        <div className="absolute inset-0 mil-grid-bg" style={{ opacity: 0.15 }}></div>
        <div className="relative z-10 px-8 space-y-2">
          <span className="px-3.5 py-1 bg-[#d4af37] text-[#800000] text-[10px] font-black uppercase tracking-widest">
            Thông tin - Tuyên truyền
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Bản tin chiến sĩ Tiểu đoàn 15
          </h1>
          <p className="text-white/75 text-xs md:text-sm max-w-2xl font-medium leading-relaxed">
            Cổng thông tin chính quy cập nhật các hoạt động huấn luyện bắn đạn thật súng chống tăng SPG-9, hoạt động học tập chính trị và thi đua quyết thắng của đơn vị.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-md ${
                selectedCategory === cat 
                  ? 'bg-[#800000] text-[#d4af37] shadow-md' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bản tin quân sự..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold focus:outline-none focus:border-[#800000]"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => {
            let badgeBg = 'bg-[#166534] text-green-100'; // Huấn luyện
            if (item.category === 'Chính trị') badgeBg = 'bg-[#800000] text-red-100';
            if (item.category === 'Học tập') badgeBg = 'bg-[#1e40af] text-blue-100';
            if (item.category === 'Hậu cần') badgeBg = 'bg-[#d4af37] text-slate-900';

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className={`absolute top-4 left-4 px-3.5 py-1 text-[8px] font-black uppercase tracking-widest ${badgeBg}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center text-slate-400 space-x-2 text-[9px] font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                      </span>
                    </div>
                    <h3 className="text-md font-black text-slate-900 group-hover:text-[#800000] transition-colors leading-snug line-clamp-2 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      setActiveNewsDetail(item);
                      setCommentSubmitted(false);
                      setQuickComment('');
                    }}
                    className="w-full text-center bg-slate-50 border border-slate-200 text-slate-700 py-3 text-[10px] font-black uppercase tracking-widest group-hover:bg-[#800000] group-hover:text-[#d4af37] group-hover:border-[#800000] transition-all"
                  >
                    Đọc bản tin
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-20 bg-white border border-slate-200 rounded-3xl">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Không tìm thấy bản tin nào tương ứng</p>
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT BẢN TIN */}
      {activeNewsDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[85vh] rounded-[2rem] border-4 border-[#800000]/20 shadow-2xl overflow-hidden flex flex-col justify-between animate-subtle">
            {/* Header Modal */}
            <div className="bg-[#2d0000] text-white p-6 relative flex items-center justify-between border-b-4 border-[#d4af37]">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-[#d4af37] text-[#800000] text-[8px] font-black uppercase tracking-widest">
                  {activeNewsDetail.category}
                </span>
                <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest mt-1">
                  Đăng ngày: {activeNewsDetail.createdAt ? new Date(activeNewsDetail.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}
                </p>
              </div>
              <button 
                onClick={() => setActiveNewsDetail(null)}
                className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scroll */}
            <div className="p-8 overflow-y-auto space-y-6 flex-grow">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight uppercase border-b border-slate-100 pb-4">
                {activeNewsDetail.title}
              </h2>
              
              {activeNewsDetail.imageUrl && (
                <div className="w-full h-56 rounded-xl overflow-hidden shadow-inner">
                  <img src={activeNewsDetail.imageUrl} alt="Tư liệu" className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-xs font-black text-[#800000] bg-red-50 p-4 border-l-4 border-[#800000] leading-relaxed uppercase tracking-tight">
                {activeNewsDetail.summary}
              </p>

              <div className="text-sm text-slate-700 leading-relaxed font-medium space-y-4 whitespace-pre-line">
                {activeNewsDetail.content}
              </div>

              {/* Form Góp ý Nhanh cho Bản tin */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-8 space-y-4">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-[#800000]" />
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700">Phản hồi ý kiến về bản tin này</h4>
                </div>
                
                {commentSubmitted ? (
                  <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-bold animate-subtle">
                     <CheckCircle className="w-5 h-5 text-green-600" />
                     <span>Trực ban Tiểu đoàn đã ghi nhận ý kiến phản hồi về bản tin của quý khách!</span>
                  </div>
                ) : (
                  <form onSubmit={handleQuickCommentSubmit} className="space-y-3">
                    <textarea
                      placeholder="Nhập ý kiến phản hồi hoặc cảm nghĩ của quý vị..."
                      value={quickComment}
                      onChange={(e) => setQuickComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-medium rounded-lg focus:outline-none focus:border-[#800000]"
                    ></textarea>
                    <button
                      type="submit"
                      disabled={!quickComment.trim()}
                      className="bg-[#800000] hover:bg-black text-[#d4af37] px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ml-auto disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi phản hồi</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] font-mono text-slate-400 uppercase font-black">Lực lượng bảo đảm thông tin • Tiểu đoàn 15</span>
              </div>
              <button
                onClick={() => setActiveNewsDetail(null)}
                className="bg-[#800000] text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
