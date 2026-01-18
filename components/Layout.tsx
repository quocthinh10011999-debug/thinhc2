
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, Home, BookOpen, History, UserPlus, 
  MessageSquare, LogOut, Settings, LogIn, 
  Search, Calendar, Phone, Globe, Facebook, 
  Youtube, ChevronRight, Menu, X, RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TopBar = () => {
  const { config } = useTheme();
  const [date, setDate] = useState('');
  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="bg-[#2d0000] py-1.5 hidden md:block border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-medium text-white/50 uppercase tracking-widest">
        <div className="flex items-center space-x-6">
          <span className="flex items-center"><Calendar className="w-3 h-3 mr-2 text-[#d4af37]" /> {date}</span>
          <span className="flex items-center border-l border-white/10 pl-6"><Phone className="w-3 h-3 mr-2 text-[#d4af37]" /> Hotline: {config.contactPhone}</span>
        </div>
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-3 pr-5 border-r border-white/10">
            <Facebook className="w-3.5 h-3.5 hover:text-[#d4af37] transition-colors cursor-pointer" />
            <Youtube className="w-3.5 h-3.5 hover:text-[#d4af37] transition-colors cursor-pointer" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#d4af37]">VN</span>
            <span className="text-white/20">|</span>
            <span className="hover:text-white cursor-pointer">EN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderMain = () => {
  const { config, isSyncing } = useTheme();
  return (
    <header className="bg-white pt-6 pb-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-5 group">
          <div className="bg-[#800000] w-16 h-16 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <Shield className="w-10 h-10 text-[#d4af37]" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <div className="h-[2px] w-6 bg-[#800000]"></div>
              <span className="text-[10px] font-bold text-[#800000] uppercase tracking-[0.3em]">Cổng thông tin điện tử</span>
              {isSyncing && (
                <div className="flex items-center ml-4 text-[9px] font-black text-green-600 animate-pulse">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> SYNCING...
                </div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight mt-0.5" style={{ color: config.logoTextColor1 }}>
              {config.unitName.split(' ')[0]} <span style={{ color: config.logoTextColor2 }}>{config.unitName.split(' ').slice(1).join(' ')}</span>
            </h1>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{config.unitSubName}</span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-10">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cơ quan thường trực</span>
            <span className="text-[12px] font-bold text-[#800000] border-b-2 border-[#d4af37]">TRỰC BAN TIỂU ĐOÀN</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="pl-10 pr-4 py-2 text-[12px] bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#800000] focus:bg-white transition-all w-48 font-medium" 
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]" />
          </div>
        </div>
      </div>
    </header>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/quy-dinh', label: 'Quy định', icon: BookOpen },
    { path: '/truyen-thong', label: 'Truyền thống', icon: History },
    { path: '/dang-ky', label: 'Đăng ký', icon: UserPlus },
    { path: '/gop-y', label: 'Góp ý', icon: MessageSquare },
  ];

  return (
    <nav className="bg-[#800000] sticky top-0 z-50 shadow-md border-y border-[#d4af37]/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="hidden md:flex h-full">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 flex items-center text-[11px] font-bold transition-all h-full relative group uppercase tracking-widest ${
                    isActive ? 'bg-black/20 text-[#d4af37]' : 'hover:bg-black/10 text-white/80'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#d4af37]"></div>
                  )}
                </Link>
              );
            })}
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-[10px] font-bold text-[#d4af37] flex items-center bg-black/30 px-4 py-1.5 rounded border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#800000] transition-all uppercase tracking-widest">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-2" /> Admin Area
                  </Link>
                )}
                <div className="flex items-center space-x-3 bg-black/10 px-4 py-1.5 rounded-md">
                  <span className="text-[10px] font-bold text-white/80 uppercase">{user.fullName}</span>
                  <button onClick={() => { logout(); navigate('/'); }} className="text-white hover:text-[#d4af37] transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/40 px-5 py-2 rounded uppercase hover:bg-[#d4af37] hover:text-[#800000] transition-all tracking-widest">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const { config } = useTheme();
  return (
    <footer className="bg-[#d4af37] text-[#800000] pt-20 pb-10 border-t-8 border-[#800000]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-16 border-b border-[#800000]/20">
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center space-x-5">
              <div className="bg-[#800000] w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                {config.logoUrl ? (
                  <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <Shield className="w-10 h-10 text-[#d4af37]" />
                )}
              </div>
              <div>
                <h3 className="text-[#800000] font-black text-xl uppercase tracking-tight">{config.unitName}</h3>
                <p className="text-[10px] text-white bg-[#800000] px-2 py-0.5 font-black uppercase tracking-[0.2em] inline-block">{config.slogan}</p>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed italic border-l-4 border-[#800000] pl-6 font-semibold">
              "Sẵn sàng chiến đấu hy sinh vì độc lập tự do của Tổ quốc, vì chủ nghĩa xã hội. Nhiệm vụ nào cũng hoàn thành, khó khăn nào cũng vượt qua, kẻ thù nào cũng đánh thắng."
            </p>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-[#800000] font-black text-xs uppercase mb-8 tracking-widest underline decoration-[#800000] decoration-2 underline-offset-8">Thông tin liên hệ</h4>
            <div className="text-[13px] space-y-5 font-bold">
              <p className="flex items-start">
                <Globe className="w-5 h-5 mr-4 text-[#800000] shrink-0" /> 
                <span>{config.contactAddress}</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-5 h-5 mr-4 text-[#800000] shrink-0" /> 
                <span>{config.contactPhone}</span>
              </p>
            </div>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-[#800000] font-black text-xs uppercase mb-8 tracking-widest underline decoration-[#800000] decoration-2 underline-offset-8">Liên kết</h4>
            <ul className="text-[13px] space-y-4 font-bold">
              {['Báo Quân đội nhân dân', 'Bộ Quốc phòng', 'Truyền hình Quốc phòng'].map((link) => (
                <li key={link} className="hover:text-white transition-colors cursor-pointer flex items-center group">
                   <ChevronRight className="w-3.5 h-3.5 mr-2 text-[#800000]" /> {link}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#800000]">
          <p>{config.footerCopyright}</p>
          <div className="mt-4 md:mt-0 flex space-x-8">
             <span className="hover:text-white cursor-pointer transition-colors">Bảo mật</span>
             <span className="hover:text-white cursor-pointer transition-colors">Điều khoản</span>
             <span className="text-[#800000]/60">VERSION {config.version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <HeaderMain />
      <Navbar />
      <main className="flex-grow animate-subtle">{children}</main>
      <Footer />
    </div>
  );
};
