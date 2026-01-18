
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Cpu, ChevronRight, Fingerprint, Terminal, Activity, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');
    
    // Giả lập độ trễ xác thực an ninh để tạo cảm giác chuyên nghiệp
    setTimeout(() => {
      if (login(username, password)) {
        // Điều hướng thông minh dựa trên tài khoản
        if (username.toLowerCase() === 'admin') {
          navigate('/admin');
        } else {
          navigate('/'); // Nhân viên thường quay về trang chủ hoặc trang nghiệp vụ cụ thể
        }
      } else {
        setError('XÁC THỰC THẤT BẠI: SAI MÃ ĐỊNH DANH HOẶC MẬT KHẨU');
        setIsAuthenticating(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-fixed-military" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=2000')" }}>
      
      {/* Lớp phủ Gradient quân đội */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d0000]/95 via-[#800000]/85 to-[#000000]/90"></div>
      
      {/* Hiệu ứng Grid & Scanline */}
      <div className="absolute inset-0 mil-grid opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>

      {/* Decorative Elements - Tactical Status */}
      <div className="absolute top-10 left-10 hidden lg:block space-y-4">
        <div className="flex items-center space-x-3 text-[#d4af37]/60">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Encrypted Channel: Active</span>
        </div>
        <div className="flex items-center space-x-3 text-[#d4af37]/60">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Security Level: Restricted</span>
        </div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-subtle">
        <div className="bg-black/40 backdrop-blur-xl border-2 border-[#d4af37]/30 shadow-[0_0_50px_rgba(128,0,0,0.5)] overflow-hidden">
          
          {/* Header Bảng điều khiển */}
          <div className="bg-[#800000] px-8 py-4 flex justify-between items-center border-b border-[#d4af37]/40">
            <div className="flex items-center space-x-3">
                <Terminal className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em]">Cổng xác thực cán bộ</span>
            </div>
            <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-[#d4af37]/20"></div>
                <div className="w-2 h-2 rounded-full bg-[#d4af37]/50"></div>
                <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></div>
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="text-center space-y-5">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-[#800000]/40 flex items-center justify-center mx-auto border-2 border-[#d4af37] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <Fingerprint className="w-10 h-10 text-[#d4af37]" />
                </div>
                {isAuthenticating && (
                    <div className="absolute inset-0 border-4 border-t-[#d4af37] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Đăng nhập <span className="text-[#d4af37]">Hệ thống</span></h2>
                <p className="text-[#d4af37]/60 text-[9px] font-bold uppercase tracking-[0.4em]">Quản trị Trung tâm</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-900/40 border-l-4 border-[#ff4d4d] p-4 flex items-center space-x-4 animate-shake">
                  <AlertCircle className="w-5 h-5 text-[#ff4d4d] shrink-0" />
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider leading-relaxed">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest block opacity-70">Mã định danh quân sự</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 group-focus-within:text-[#d4af37] transition-colors">
                        <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" required
                      placeholder="Username (admin)"
                      className="w-full pl-14 pr-4 py-4 text-sm font-bold bg-white/5 border border-white/10 focus:border-[#d4af37] focus:bg-white/10 outline-none transition-all text-white placeholder:text-white/20 uppercase tracking-widest"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest block opacity-70">Mật khẩu an ninh</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 group-focus-within:text-[#d4af37] transition-colors">
                        <Lock className="w-5 h-5" />
                    </div>
                    <input 
                      type="password" required
                      placeholder="Mật khẩu (admin123)"
                      className="w-full pl-14 pr-4 py-4 text-sm font-bold bg-white/5 border border-white/10 focus:border-[#d4af37] focus:bg-white/10 outline-none transition-all text-white placeholder:text-white/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-[#d4af37] text-[#800000] py-4 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center space-x-4 disabled:opacity-50 shadow-[0_10px_20px_rgba(0,0,0,0.3)] group"
                >
                  {isAuthenticating ? (
                    <>
                      <Cpu className="w-5 h-5 animate-spin" />
                      <span>Đang giải mã...</span>
                    </>
                  ) : (
                    <>
                      <span>Truy cập cơ sở dữ liệu</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-8 border-t border-white/10 flex flex-col items-center space-y-4">
               <div className="flex items-center space-x-2">
                   <Shield className="w-3 h-3 text-[#d4af37]" />
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Hệ thống bảo vệ đa tầng</span>
               </div>
               <Link to="/" className="text-[10px] font-black text-[#d4af37] hover:text-white uppercase tracking-widest transition-colors flex items-center">
                   <ChevronRight className="w-3 h-3 rotate-180 mr-2" /> Về trang chủ
               </Link>
            </div>
          </div>
        </div>
        
        {/* Footer Technical Info */}
        <div className="mt-8 text-center">
            <p className="text-[9px] font-mono text-[#d4af37]/40 uppercase tracking-[0.5em]">Terminal ID: ADMIN-CONSOLE // Build 4.0.0-PRO</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
