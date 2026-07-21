
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, Home, BookOpen, History, UserPlus, 
  MessageSquare, LogOut, Settings, LogIn, 
  Search, Calendar, Phone, Globe, Facebook, 
  Youtube, ChevronRight, Menu, X, RefreshCw,
  LayoutDashboard, Volume2, VolumeX, Music,
  BrainCircuit, ShieldCheck, Newspaper
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Fix: Import useTheme from ThemeContext.tsx
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';

// Fix: Implement missing TopBar component
const TopBar = () => {
  const { config } = useTheme();
  return (
    <div className="bg-[#2d0000] text-white/50 py-2 px-6 border-b border-white/5 hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
        <div className="flex items-center space-x-6">
          <span className="flex items-center"><Phone className="w-3 h-3 mr-2 text-[#d4af37]" /> Hotline: {config.contactPhone}</span>
          <span className="flex items-center"><Globe className="w-3 h-3 mr-2 text-[#d4af37]" /> {config.contactAddress}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[#d4af37]">Security Level: Restricted Area</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

// Fix: Implement missing HeaderMain component
const HeaderMain = () => {
  const { config } = useTheme();
  return (
    <>
      <TopBar />
      <header className="bg-white py-6 px-6 border-b-4 border-[#800000]">
        <div className="max-w-7xl mx-auto flex items-center space-x-6">
          <div className="w-16 h-16 bg-[#800000] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <Shield className="w-8 h-8 text-[#d4af37]" />
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight" style={{ color: config.logoTextColor1 }}>
              {config.unitName.split(' ')[0]} <span style={{ color: config.logoTextColor2 }}>{config.unitName.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">{config.unitSubName}</p>
          </div>
        </div>
      </header>
    </>
  );
};

// Fix: Implement missing FloatingMusicPlayer component
const FloatingMusicPlayer = () => {
  const { isPlaying, togglePlay, activeTrack } = useMusic();
  if (!activeTrack) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-center group">
      <div className="bg-black/80 backdrop-blur-xl border border-[#d4af37]/30 p-2 rounded-full flex items-center space-x-0 group-hover:space-x-4 transition-all pr-2 group-hover:pr-6 shadow-2xl overflow-hidden">
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${isPlaying ? 'bg-[#d4af37] text-[#800000]' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <div className="w-0 group-hover:w-40 transition-all overflow-hidden">
          <p className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest leading-none mb-1">Âm nhạc đơn vị</p>
          <p className="text-[10px] font-bold text-white uppercase truncate">{activeTrack.title}</p>
        </div>
      </div>
    </div>
  );
};

// Fix: Implement missing Footer component
const Footer = () => {
  const { config } = useTheme();
  return (
    <footer className="bg-[#1a1a1a] text-white py-16 px-6 border-t-8 border-[#d4af37]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-[#d4af37]" />
            <span className="text-xl font-black tracking-tighter uppercase">{config.unitName}</span>
          </div>
          <p className="text-white/40 text-xs leading-relaxed font-medium uppercase tracking-wider">
            {config.slogan}
          </p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[#d4af37] text-xs font-black uppercase tracking-widest">Liên hệ đơn vị</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white/60">
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[11px] font-bold">{config.contactPhone}</span>
            </div>
            <div className="flex items-center space-x-3 text-white/60">
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[11px] font-bold">{config.contactAddress}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[#d4af37] text-xs font-black uppercase tracking-widest">Truyền thông</h4>
          <div className="flex space-x-4">
            <a href="#" className="p-3 bg-white/5 hover:bg-[#d4af37] hover:text-[#800000] transition-all rounded-full">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-3 bg-white/5 hover:bg-[#d4af37] hover:text-[#800000] transition-all rounded-full">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{config.footerCopyright}</p>
        <div className="flex items-center space-x-2 text-[10px] font-bold text-white/20 uppercase">
          <ShieldCheck className="w-3 h-3" />
          <span>VMS Command v5.0.0</span>
        </div>
      </div>
    </footer>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/tin-tuc', label: 'Tin tức', icon: Newspaper },
    { path: '/quy-dinh', label: 'Quy định', icon: BookOpen },
    { path: '/truyen-thong', label: 'Truyền thống', icon: History },
    { path: '/dang-ky', label: 'Đăng ký', icon: UserPlus },
    { path: '/thi-nhan-thuc', label: 'Thi nhận thức', icon: BrainCircuit },
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

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderMain />
      <Navbar />
      <main className="flex-grow animate-subtle">{children}</main>
      <Footer />
      <FloatingMusicPlayer />
    </div>
  );
};
