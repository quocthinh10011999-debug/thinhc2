
import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldAlert, MessageSquare, Star, History, ArrowRight, ChevronRight, UserPlus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

  return (
    <div className="space-y-0">
      <section className="relative py-40 border-b-8 border-[#d4af37] bg-fixed-military" style={{ backgroundImage: `url('${config.homeHeroBg}')` }}>
        {/* Lớp phủ tối màu chuyên nghiệp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d0000]/95 via-[#800000]/75 to-black/40"></div>
        <div className="absolute inset-0 mil-grid-bg" style={{ opacity: 0.15 }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-left flex flex-col items-start space-y-8">
          <div className="inline-flex items-center space-x-3 bg-white/10 border-l-4 border-[#d4af37] px-6 py-2 backdrop-blur-md">
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">{config.unitName} • {config.slogan}</span>
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

      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-24">
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
