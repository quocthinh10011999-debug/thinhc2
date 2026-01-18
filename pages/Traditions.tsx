
import React from 'react';
import { Medal, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const MilestoneItem = ({ year, title, desc, img, index }: any) => {
  const isEven = index % 2 === 0;
  return (
    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center mb-32 last:mb-0`}>
      <div className="w-full lg:w-1/2 space-y-8">
        <div className="flex items-center space-x-6">
            <span className="text-5xl font-black text-[#800000] italic leading-none">{year}</span>
            <div className="h-[3px] flex-grow bg-gradient-to-r from-[#d4af37] to-transparent"></div>
        </div>
        <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight leading-tight">{title}</h3>
        <p className="text-slate-600 text-base font-semibold leading-relaxed italic border-l-8 border-[#800000] pl-8">{desc}</p>
      </div>
      <div className="w-full lg:w-1/2">
        <div className="relative aspect-video overflow-hidden border-8 border-white shadow-heavy group">
            <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={title} />
        </div>
      </div>
    </div>
  );
};

const Traditions = () => {
  const { config } = useTheme();

  return (
    <div className="bg-[#fcf8f0]">
      <section className="relative py-40 overflow-hidden text-center bg-fixed-military" style={{ backgroundImage: `url('${config.tradHeroBg}')` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#800000] via-[#800000]/90 to-[#2d0000]"></div>
        <div className="absolute inset-0 mil-grid opacity-10"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-10">
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">
            <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
            <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Lịch sử đơn vị</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none whitespace-pre-line">
            {config.tradHeroTitle.split(' ').slice(0, 3).join(' ')} <br/> 
            <span className="text-[#d4af37]">{config.tradHeroTitle.split(' ').slice(3).join(' ')}</span>
          </h1>
          <p className="text-white/70 text-lg font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-wider">{config.tradHeroSub}</p>
        </div>
      </section>

      <section className="py-32 bg-white relative">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {config.milestones.map((m, idx) => (
            <MilestoneItem key={idx} index={idx} {...m} />
          ))}
        </div>
      </section>

      <section className="relative py-32 bg-[#2d0000] border-t-8 border-[#d4af37]">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-12">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">Gìn giữ truyền thống - Vững bước tương lai</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/dang-ky" className="bg-[#d4af37] text-[#800000] px-12 py-5 font-black text-[12px] uppercase tracking-widest hover:bg-white transition-all">Đăng ký thăm chiến sĩ</Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Traditions;
