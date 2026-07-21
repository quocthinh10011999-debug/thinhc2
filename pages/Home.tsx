import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, ShieldAlert, MessageSquare, Star, History, ArrowRight, ChevronRight, ChevronLeft, UserPlus, 
  Volume2, VolumeX, Newspaper, Clock, Search, Sparkles, BookOpen, X, Info, FileText, Send, CheckCircle,
  Link as LinkIcon, Share2, ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { generateMilitaryNewsDraft } from '../services/geminiService';

const ServiceCard = ({ icon: Icon, title, desc, path, bgColor, iconColor }: any) => (
  <Link to={path} className={`group ${bgColor} p-8 aspect-square rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border-4 border-white/20`}>
    <div className={`w-16 h-16 ${iconColor} bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
        <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight leading-tight">{title}</h3>
    <p className="text-[12px] text-white/80 leading-relaxed font-medium line-clamp-2">{desc}</p>
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="text-white w-6 h-6 animate-pulse" />
    </div>
  </Link>
);

const Home = () => {
  const { config } = useTheme();
  const { isPlaying, togglePlay, activeTrack } = useMusic();
  const { news, addNews } = useData();
  const { user } = useAuth();

  // State quản lý tin tức
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNewsDetail, setActiveNewsDetail] = useState<any | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  
  // State góp ý nhanh bản tin
  const [quickComment, setQuickComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Copy link state
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    const shareUrl = `${window.location.origin}/?newsId=${itemId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  // State soạn thảo bằng AI
  const [aiTopic, setAiTopic] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiPublishSuccess, setAiPublishSuccess] = useState(false);

  // Live Routine Trackers
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }, 15000); // cập nhật mỗi 15 giây
    return () => clearInterval(timer);
  }, []);

  const categories = ['Tất cả', 'Huấn luyện', 'Chính trị', 'Học tập', 'Hậu cần'];

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const routineSchedule = [
    { time: '05:00', title: 'Báo thức', desc: 'Toàn đơn vị báo thức, tập trung quân số buổi sáng.', icon: '📢', start: 5.0, end: 5.25 },
    { time: '05:15', title: 'Thể dục sáng', desc: 'Chạy vũ trang, tập thể dục và sắp đặt nội vụ.', icon: '🏃', start: 5.25, end: 6.0 },
    { time: '06:00', title: 'Ăn sáng', desc: 'Bảo đảm dinh dưỡng sẵn sàng cho ngày mới.', icon: '🍲', start: 6.0, end: 7.0 },
    { time: '07:00', title: 'Chào cờ / Đội ngũ', desc: 'Chào cờ quân phong hoặc kiểm tra điều lệnh.', icon: '🇻🇳', start: 7.0, end: 7.5 },
    { time: '07:30', title: 'Huấn luyện SPG-9', desc: 'Học tập kỹ chiến thuật súng chống tăng, thực địa.', icon: '🎯', start: 7.5, end: 11.5 },
    { time: '11:30', title: 'Ăn trưa & Nghỉ trưa', desc: 'Thời gian ăn trưa tập trung và nghỉ ngơi.', icon: '💤', start: 11.5, end: 14.0 },
    { time: '14:00', title: 'Bảo quản vũ khí', desc: 'Lau chùi vũ khí, khí tài, trang thiết bị.', icon: '🔧', start: 14.0, end: 17.0 },
    { time: '17:00', title: 'Thể thao & Tăng gia', desc: 'Chạy bộ, bóng chuyền, chăm sóc vườn tăng gia.', icon: '🌱', start: 17.0, end: 18.0 },
    { time: '18:00', title: 'Ăn tối', desc: 'Bảo đảm cơm chiều đúng giờ quy định.', icon: '🍚', start: 18.0, end: 19.0 },
    { time: '19:00', title: 'Thời sự, đọc báo', desc: 'Nghe tin tức chính trị, thời sự đài truyền hình.', icon: '📺', start: 19.0, end: 21.0 },
    { time: '21:00', title: 'Điểm quân số', desc: 'Điểm danh cấp trung đội, nhận xét huấn luyện ngày.', icon: '📋', start: 21.0, end: 21.5 },
    { time: '21:30', title: 'Tắt đèn ngủ nghỉ', desc: 'Toàn đơn vị tắt đèn, bảo đảm an ninh nghiêm ngặt.', icon: '🌙', start: 21.5, end: 24.0 },
  ];

  const getIsActiveRoutine = (start: number, end: number) => {
    const decTime = currentHour + currentMinute / 60;
    // Xử lý ca tắt đèn kéo dài qua đêm
    if (start === 21.5 && (decTime >= 21.5 || decTime < 5.0)) {
      return true;
    }
    return decTime >= start && decTime < end;
  };

  const handleGenerateAIDraft = async () => {
    if (!aiTopic.trim()) return;
    setIsAiGenerating(true);
    setAiResult(null);
    setAiPublishSuccess(false);
    try {
      const draft = await generateMilitaryNewsDraft(aiTopic);
      setAiResult(draft);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePublishAiNews = async () => {
    if (!aiResult) return;
    try {
      await addNews({
        title: aiResult.title,
        category: 'Chính trị',
        summary: aiResult.summary,
        content: aiResult.content,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
      });
      setAiPublishSuccess(true);
      // Xóa form
      setAiTopic('');
      setAiResult(null);
      // Đóng modal nếu cần
    } catch (e) {
      console.error("Xảy ra lỗi khi xuất bản tin tức:", e);
    }
  };

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
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative py-40 border-b-8 border-[#d4af37] bg-fixed-military" style={{ backgroundImage: `url('${config.homeHeroBg}')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d0000]/95 via-[#800000]/75 to-black/40"></div>
        <div className="absolute inset-0 mil-grid-bg" style={{ opacity: 0.15 }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-left flex flex-col items-start space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full justify-between">
            <div className="inline-flex items-center space-x-3 bg-white/10 border-l-4 border-[#d4af37] px-6 py-2 backdrop-blur-md">
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">{config.unitName} • {config.slogan}</span>
            </div>
            
            {activeTrack && (
              <button 
                onClick={togglePlay}
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 border border-white/30 px-5 py-2.5 rounded-full backdrop-blur-md transition-all group"
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isPlaying ? 'bg-[#d4af37] text-[#800000]' : 'bg-white/20 text-white'}`}>
                  {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div className="text-left overflow-hidden">
                   <p className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest leading-none mb-1">Âm nhạc đơn vị</p>
                   <p className="text-[10px] font-bold text-white uppercase truncate max-w-[120px]">{isPlaying ? 'Đang phát...' : 'Đã tắt'}</p>
                </div>
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl md:text-8xl font-black leading-[1.1] uppercase tracking-tighter max-w-4xl">
              <span className="text-[#ff4d4d] drop-shadow-md">{config.homeHeroTitle.split(' - ')[0]}</span> <br/>
              <span className="text-[#ffd700] drop-shadow-md">{config.homeHeroTitle.split(' - ')[1]}</span>
            </h2>
            <p className="text-[#d4af37] text-2xl font-black uppercase tracking-widest mt-4 italic">
                Chào mừng bạn đến với Tiểu đoàn 15 SPG-9
            </p>
          </div>

          <div className="h-1.5 w-32 bg-[#d4af37]"></div>
          
          <p className="text-white/90 text-xl font-medium max-w-2xl leading-relaxed">
            {config.homeHeroSubTitle}
          </p>

          <div className="flex flex-col md:flex-row gap-5 pt-4">
            <Link to="/dang-ky" className="bg-[#d4af37] text-[#800000] px-12 py-5 font-black text-[13px] uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center group rounded-full">
                Bắt đầu Đăng ký <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Cards Overlay Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard 
            icon={UserPlus} 
            title="Đăng ký số" 
            desc="Hệ thống đăng ký thăm quân nhân trực tuyến nhanh chóng và an toàn." 
            path="/dang-ky"
            bgColor="bg-[#800000]"
            iconColor="text-[#800000]"
          />
          <ServiceCard 
            icon={History} 
            title="Truyền thống" 
            desc="Lịch sử hào hùng và những mốc son chói lọi của Tiểu đoàn 15." 
            path="/truyen-thong"
            bgColor="bg-[#1e40af]"
            iconColor="text-[#1e40af]"
          />
          <ServiceCard 
            icon={ShieldAlert} 
            title="Quy định" 
            desc="Nội quy an ninh và hướng dẫn tác phong khi ra vào đơn vị." 
            path="/quy-dinh"
            bgColor="bg-[#166534]"
            iconColor="text-[#166534]"
          />
          <ServiceCard 
            icon={MessageSquare} 
            title="Hòm thư góp ý" 
            desc="Kênh tiếp nhận kiến nghị và giải đáp thắc mắc cho thân nhân." 
            path="/gop-y"
            bgColor="bg-[#9a3412]"
            iconColor="text-[#9a3412]"
          />
        </div>
      </section>

      {/* BẢN TIN & LỊCH CÔNG TÁC TRANG CHỦ (Two-Column Layout) */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="border-l-8 border-[#800000] pl-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-900 tracking-tight flex items-center">
            <Newspaper className="w-8 h-8 text-[#800000] mr-3" />
            Bản tin & Chế độ trong ngày
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Cập nhật tin tức hoạt động chính quy và thời khóa biểu chiến sĩ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CỘT TRÁI: DÂN TIN & HOẠT ĐỘNG (2/3 Width) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Thanh Tìm Kiếm & Lọc Thể Loại */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-md ${
                      selectedCategory === cat 
                        ? 'bg-[#800000] text-[#d4af37] shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm bản tin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold focus:outline-none focus:border-[#800000]"
                />
              </div>
            </div>

            {/* Danh Sách Tin Tức */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className="relative h-48 overflow-hidden bg-slate-900">
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
                            <span className="absolute bottom-4 right-4 bg-black/75 text-[#d4af37] px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5 shadow-md">
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
                <div className="col-span-2 text-center py-20 bg-white border border-slate-200 rounded-3xl">
                  <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Không có bản tin nào khớp với bộ lọc</p>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: CHẾ ĐỘ SINH HOẠT & AI DRAFTER (1/3 Width) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Widget: Live Military Daily Routine Tracker */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#800000]" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Chế độ trong ngày</h3>
                </div>
                <span className="bg-red-50 text-[#800000] text-[9px] font-mono px-2 py-0.5 rounded font-black">
                  {currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {routineSchedule.map((step, idx) => {
                  const isActive = getIsActiveRoutine(step.start, step.end);
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start space-x-3 p-3 rounded-xl border transition-all ${
                        isActive 
                          ? 'bg-red-50 border-[#800000] shadow-sm scale-102 ring-2 ring-[#800000]/10' 
                          : 'bg-slate-50 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className="text-xl mt-0.5">{step.icon}</div>
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{step.title}</p>
                          <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-[#800000]' : 'text-slate-400'}`}>
                            {step.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                        {isActive && (
                          <div className="flex items-center space-x-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                            <span className="text-[8px] font-black text-[#800000] uppercase tracking-wider">Nhiệm vụ hiện tại</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget: AI Drafting Assistant */}
            <div className="bg-[#800000] text-white rounded-3xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-48 h-48" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center space-x-2 text-[#d4af37]">
                  <Sparkles className="w-5 h-5 fill-[#d4af37] animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Trợ lý AI biên soạn</h3>
                </div>
                <div>
                  <h4 className="text-md font-black uppercase leading-tight">Phác thảo bản tin quân sự</h4>
                  <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider mt-1">Sử dụng Trí tuệ Nhân tạo để tạo nháp tuyên truyền</p>
                </div>

                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Nhập chủ đề (VD: Thể thao ngày hè, Đọc sách...)"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs font-semibold rounded-lg focus:outline-none focus:border-[#d4af37] transition-all"
                  />
                  
                  <button
                    onClick={handleGenerateAIDraft}
                    disabled={isAiGenerating || !aiTopic.trim()}
                    className="w-full bg-[#d4af37] text-[#800000] py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isAiGenerating ? (
                      <>
                        <div className="w-3 h-3 border-2 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
                        <span>AI Đang Phác Thảo...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 fill-[#800000]" />
                        <span>Xem Phác Thảo</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Draft Result */}
                {aiResult && (
                  <div className="bg-black/30 border border-white/10 p-4 rounded-xl space-y-3 animate-subtle mt-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest">Bản nháp AI đề xuất</span>
                      <button onClick={() => setAiResult(null)} className="text-white/40 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-[#d4af37] uppercase leading-snug">{aiResult.title}</p>
                      <p className="text-[9px] text-white/80 font-bold leading-relaxed">{aiResult.summary}</p>
                      <p className="text-[9px] text-white/60 leading-relaxed font-medium line-clamp-3">{aiResult.content}</p>
                    </div>

                    <div className="pt-2">
                      {user && user.role === 'admin' ? (
                        <button
                          onClick={handlePublishAiNews}
                          className="w-full bg-green-600 text-white py-2 text-[9px] font-black uppercase tracking-widest hover:bg-green-500 transition-all"
                        >
                          Xuất bản chính thức
                        </button>
                      ) : (
                        <div className="bg-amber-950/40 p-2.5 border border-amber-500/20 rounded text-[8px] font-bold uppercase text-amber-300 text-center">
                          Chỉ Sĩ quan Trực ban (Admin) mới có quyền Đăng bản tin
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {aiPublishSuccess && (
                  <div className="bg-green-950/50 p-4 border border-green-500/30 rounded-xl flex items-start space-x-2 animate-subtle mt-4">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-green-300">Xuất bản thành công!</p>
                      <p className="text-[8px] text-green-400/80 uppercase font-bold mt-0.5">Bản tin đã được đồng bộ lên Cloud và hiển thị trên Trang chủ.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Quote Banner */}
      <section className="relative py-32 bg-fixed-military" style={{ backgroundImage: `url('${config.regHeroBg}')` }}>
         <div className="absolute inset-0 bg-[#2d0000]/90"></div>
         <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
            <Star className="w-12 h-12 text-[#ffd700] mx-auto fill-[#ffd700] animate-pulse" />
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic leading-tight">
              {config.homeQuote}
            </h3>
            <div className="w-20 h-1 bg-[#d4af37] mx-auto"></div>
            <p className="text-[11px] font-bold text-[#ffd700] uppercase tracking-[0.3em]">{config.homeQuoteAuthor}</p>
         </div>
      </section>
    </div>
  );
};

export default Home;
