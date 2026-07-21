
import React from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Shield, Users, Settings, LayoutDashboard, 
  LogOut, ChevronRight, Bell, User, 
  Monitor, Database, ShieldCheck, ClipboardCheck,
  BrainCircuit, BookOpen, Newspaper
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Fix: Import useTheme from ThemeContext.tsx
import { useTheme } from '../context/ThemeContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { config } = useTheme();
  
  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/admin/registrations', label: 'Quản lý Đăng ký', icon: ClipboardCheck },
    { path: '/admin/ideology', label: 'Công tác Tư tưởng', icon: BrainCircuit },
    { path: '/admin/quiz', label: 'Quản lý Thi/Bộ đề', icon: BookOpen },
    { path: '/admin/news', label: 'Quản lý Bản tin', icon: Newspaper },
    { path: '/admin/users', label: 'Quản lý Nhân sự', icon: Users },
    { path: '/admin/settings', label: 'Tùy biến Giao diện', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#1a1a1a] text-white flex flex-col h-screen sticky top-0 border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="bg-[#800000] w-10 h-10 rounded flex items-center justify-center overflow-hidden shrink-0">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
            ) : (
              <Shield className="w-6 h-6 text-[#d4af37]" />
            )}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] truncate">Admin Panel</h2>
            <p className="text-[8px] font-bold text-white/40 uppercase">VMS Command v5.0</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-grow p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider ${
                isActive 
                ? 'bg-[#800000] text-[#d4af37] shadow-lg' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-black/20">
         <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-mono text-green-500 uppercase">System: Online</span>
         </div>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        <main className="p-8 animate-subtle overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
