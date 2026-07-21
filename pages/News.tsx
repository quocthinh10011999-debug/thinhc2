import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Newspaper, Clock, Search, ChevronRight, ChevronLeft, X, Info, Send, CheckCircle, Link as LinkIcon, Share2, ExternalLink } from 'lucide-react';

const News = () => {
  const { news } = useData();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNewsDetail, setActiveNewsDetail] = useState<any | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  
  // Quick comment states
  const [quickComment, setQuickComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  
  // Copy link state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Tất cả', 'Huấn luyện', 'Chính trị', 'Học tập', 'Hậu cần'];

  // Auto open news from URL query param ?newsId=...
  useEffect(() => {
    if (news && news.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const newsId = params.get('newsId');
      if (newsId) {
        const found = news.find(item => item.id.toString() === newsId);
        if (found) {
          setActiveNewsDetail(found);
          setActiveImgIndex(0);
        }
      }
    }
  }, [news]);

  const handleCopyLink = (itemId: string) => {
    const shareUrl = `${window.location.origin}/news?newsId=${itemId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

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

  const handleNextImage = (imagesLength: number) => {
    setActiveImgIndex((prev) => (prev + 1) % imagesLength);
  };

  const handlePrevImage = (imagesLength: number) => {
    setActiveImgIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
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

            const itemImages = item.imageUrl ? item.imageUrl.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
            const thumbnailSrc = itemImages[0] || 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800';

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img 
                      src={thumbnailSrc} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className={`absolute top-4 left-4 px-3.5 py-1 text-[8px] font-black uppercase tracking-widest ${badgeBg}`}>
                      {item.category}
                    </span>
                    {itemImages.length > 1 && (
                      <span className="absolute bottom-4 right-4 bg-black/75 text-[#d4af37] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5 shadow-md">
                        <span>📷 {itemImages.length} Ảnh</span>
                      </span>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                        </span>
                      </div>
                      {item.sourceUrl && (
                        <span className="text-[#800000] font-black flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                          🔗 Liên kết
                        </span>
                      )}
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
                      setActiveImgIndex(0);
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
      {activeNewsDetail && (() => {
        const modalImages = activeNewsDetail.imageUrl ? activeNewsDetail.imageUrl.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
        const hasMultipleImages = modalImages.length > 1;

        return (
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
                
                {/* Image Gallery / Slider */}
                {modalImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="w-full h-72 rounded-xl overflow-hidden shadow-inner relative bg-slate-900 group">
                      <img 
                        src={modalImages[activeImgIndex]} 
                        alt={`Hình ảnh #${activeImgIndex + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Navigation buttons */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={() => handlePrevImage(modalImages.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-[#800000] text-white flex items-center justify-center rounded-full transition-all"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={() => handleNextImage(modalImages.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-[#800000] text-white flex items-center justify-center rounded-full transition-all"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          
                          {/* Image counter index */}
                          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-[#d4af37] px-3 py-1 text-[9px] font-mono font-black uppercase tracking-wider rounded-full">
                            Ảnh {activeImgIndex + 1} / {modalImages.length}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Thumbnail slider */}
                    {hasMultipleImages && (
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {modalImages.map((imgUrl: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImgIndex(idx)}
                            className={`w-16 h-12 rounded-md overflow-hidden shrink-0 transition-all border-2 ${
                              idx === activeImgIndex ? 'border-[#800000] scale-105' : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs font-black text-[#800000] bg-red-50 p-4 border-l-4 border-[#800000] leading-relaxed uppercase tracking-tight">
                  {activeNewsDetail.summary}
                </p>

                <div className="text-sm text-slate-700 leading-relaxed font-medium space-y-4 whitespace-pre-line">
                  {activeNewsDetail.content}
                </div>

                {/* Chia sẻ & Liên kết bài viết */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-[#800000]" />
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700">Chia sẻ & Liên kết bài viết</h4>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleCopyLink(activeNewsDetail.id)}
                      className="flex-1 bg-white border border-slate-200 hover:border-[#800000] hover:bg-red-50 text-slate-700 px-4 py-3 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      {copiedId === activeNewsDetail.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600 animate-pulse" />
                          <span className="text-green-600 font-extrabold uppercase tracking-tight text-[10px]">Đã sao chép liên kết!</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4 text-slate-400" />
                          <span className="uppercase tracking-tight text-[10px]">Sao chép Link chia sẻ</span>
                        </>
                      )}
                    </button>

                    {activeNewsDetail.sourceUrl && (
                      <a
                        href={activeNewsDetail.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex-1 bg-[#800000] hover:bg-black text-[#d4af37] border border-[#800000] px-4 py-3 text-xs font-black rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 text-center shadow-md shadow-[#800000]/10"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="uppercase tracking-tight text-[10px]">Xem nguồn bài viết / Video</span>
                      </a>
                    )}
                  </div>
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
        );
      })()}
    </div>
  );
};

export default News;
