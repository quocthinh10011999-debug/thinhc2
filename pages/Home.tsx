
import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldAlert, MessageSquare, Star, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ServiceCard = ({ icon: Icon, title, desc, path }: any) => (
  <Link to={path} className="group bg-white p-8 border border-slate-200 hover:border-[#d4af37] transition-all duration-300 shadow-tactical hover:shadow-heavy">
    <div className="w-12 h-12 bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-[#800000] transition-colors">
        <Icon className="w-5 h-5 text-[#800000] group-hover:text-[#d4af37] transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-[13px] text-slate-500 leading-relaxed mb-6 font-medium">{desc}</p>
    <div className="flex items-center text-[10px] font-bold text-slate-400 group-hover:text-[#800000] uppercase tracking-widest transition-colors">
        CHI TIẾT <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

const Home = () => {
  const { config } = useTheme();

  return (
    <div className="space-y-0">
      <section className="relative py-36 border-b-8 border-[#d4af37] bg-fixed-military" style={{ backgroundImage: `url('${config.homeHeroBg}')` }}>
        {/* Lớp phủ tối màu chuyên nghiệp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d0000]/95 via-[#800000]/70 to-transparent"></div>
        <div className="absolute inset-0 mil-grid-bg" style={{ opacity: 0.2 }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-left flex flex-col items-start space-y-10">
          <div className="inline-flex items-center space-x-3 bg-black/40 border-l-4 border-[#d4af37] px-6 py-2 backdrop-blur-md">
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">{config.unitName} • {config.slogan}</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1] uppercase tracking-tighter max-w-3xl whitespace-pre-line">
            {config.homeHeroTitle.split(' - ')[0]} <br/>
            <span className="text-[#d4af37]">{config.homeHeroTitle.split(' - ')[1]}</span>
          </h2>
          <div className="h-1 w-24 bg-[#d4af37]"></div>
          <p className="text-white/80 text-lg font-medium max-w-xl leading-relaxed">
            {config.homeHeroSubTitle}
          </p>
          <div className="flex flex-col md:flex-row gap-5 pt-4">
            <Link to="/dang-ky" className="bg-[#d4af37] text-[#800000] px-10 py-4 font-black text-[12px] uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center group">
                Đăng ký thăm hỏi <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard icon={Target} title="Thủ tục số" desc="Đăng ký trực tuyến thông minh, xét duyệt hồ sơ an ninh tự động 24/7." path="/dang-ky" />
          <ServiceCard icon={ShieldAlert} title="Quy định an ninh" desc="Hướng dẫn chi tiết về nội quy ra vào doanh trại và tác phong quân đội." path="/quy-dinh" />
          <ServiceCard icon={MessageSquare} title="Trợ lý đơn vị" desc="Kênh tiếp nhận góp ý và giải đáp thắc mắc trực tiếp cho gia đình hậu phương." path="/gop-y" />
        </div>
      </section>

      <section className="relative py-32 bg-fixed-military" style={{ backgroundImage: `url('${config.regHeroBg}')` }}>
         <div className="absolute inset-0 bg-[#800000]/90"></div>
         <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
            <Star className="w-12 h-12 text-[#d4af37] mx-auto fill-[#d4af37]" />
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic leading-tight">
              {config.homeQuote}
            </h3>
            <div className="w-20 h-1 bg-[#d4af37] mx-auto"></div>
            <p className="text-[11px] font-bold text-[#d4af37] uppercase tracking-[0.3em]">{config.homeQuoteAuthor}</p>
         </div>
      </section>
    </div>
  );
};

export default Home;
