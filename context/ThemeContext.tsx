
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface Milestone {
  year: string;
  title: string;
  desc: string;
  img: string;
}

export interface RegulationSection {
  title: string;
  items: string[];
}

export interface ThemeConfig {
  // --- GENERAL & BRANDING ---
  primaryColor: string;
  secondaryColor: string;
  unitName: string;
  unitSubName: string;
  slogan: string;
  logoUrl: string;
  logoTextColor1: string;
  logoTextColor2: string;
  gridOpacity: number;
  version: string;

  // --- HEADER & FOOTER ---
  contactPhone: string;
  contactAddress: string;
  footerCopyright: string;
  
  // --- HOME PAGE ---
  homeHeroTitle: string;
  homeHeroSubTitle: string;
  homeHeroBg: string;
  homeQuote: string;
  homeQuoteAuthor: string;

  // --- REGULATIONS PAGE ---
  regHeroBg: string;
  regSections: RegulationSection[];

  // --- TRADITIONS PAGE ---
  tradHeroBg: string;
  tradHeroTitle: string;
  tradHeroSub: string;
  milestones: Milestone[];

  // --- SYSTEM ---
  isAutoSyncEnabled: boolean;
  remoteSyncUrl?: string;
}

const defaultConfig: ThemeConfig = {
  primaryColor: '#800000',
  secondaryColor: '#d4af37',
  unitName: 'TIỂU ĐOÀN 15 SPG-9',
  unitSubName: 'Sư đoàn 324 • Quân khu 4',
  slogan: 'Kỷ cương • Trách nhiệm • Quyết thắng',
  logoUrl: '',
  logoTextColor1: '#800000',
  logoTextColor2: '#d4af37',
  gridOpacity: 0.15,
  version: '4.5.0-SYNC',
  
  contactPhone: '024.3333.xxxx',
  contactAddress: 'Thị trấn Đô Lương, Đô Lương, Nghệ An',
  footerCopyright: '© 2024 TIỂU ĐOÀN 15 SPG-9 - SƯ ĐOÀN 324',

  homeHeroTitle: 'Kỷ cương THÉP - Bản sắc HÙNG',
  homeHeroSubTitle: 'Hệ thống quản lý thông tin và hỗ trợ thân nhân chiến sĩ chính quy, hiện đại và tin cậy.',
  homeHeroBg: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=2000',
  homeQuote: '"Quân đội ta trung với Đảng, hiếu với dân, sẵn sàng chiến đấu hy sinh vì độc lập tự do của Tổ quốc"',
  homeQuoteAuthor: 'Chủ tịch Hồ Chí Minh',

  regHeroBg: 'https://images.unsplash.com/photo-1579913741617-3844a30a213a?auto=format&fit=crop&q=80&w=2000',
  regSections: [
    { title: "Thủ tục vào cổng", items: ["Bắt buộc mang theo CCCD bản gốc", "Đã đăng ký trước 24h", "Trình diện đúng giờ hẹn"] },
    { title: "Tác phong văn hóa", items: ["Trang phục lịch sự", "Không mang chất cấm", "Lời nói đúng mực"] },
    { title: "Thời gian tiếp dân", items: ["Thứ 7 & CN hàng tuần", "Sáng: 07:30 - 11:00", "Chiều: 13:30 - 16:30"] }
  ],

  tradHeroBg: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=2000',
  tradHeroTitle: 'Bản Hùng Ca Bất Tử',
  tradHeroSub: 'Ghi dấu hành trình xây dựng, chiến đấu và trưởng thành của đơn vị Anh hùng LLVTND.',
  milestones: [
    { year: "1975", title: "Thành lập tiểu đoàn", desc: "Đơn vị hỏa lực mũi nhọn SPG-9 mang trọng trách chiến lược.", img: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800" },
    { year: "2000", title: "Danh hiệu Anh hùng", desc: "Sự ghi nhận cao quý nhất của Đảng và Nhà nước.", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800" }
  ],
  isAutoSyncEnabled: true
};

interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: (newConfig: Partial<ThemeConfig>) => void;
  saveConfigToCloud: () => Promise<void>;
  isSyncing: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('vms_theme_config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchRemoteConfig = useCallback(async () => {
    if (!api.getConfig().baseUrl) return;
    setIsSyncing(true);
    try {
      const remote = await api.request('settings/global_config');
      if (remote && remote.unitName) {
        setConfig(remote);
        localStorage.setItem('vms_theme_config', JSON.stringify(remote));
      }
    } catch (e) {
      console.warn("Using local theme config (Remote fetch failed)");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchRemoteConfig();
    const interval = setInterval(fetchRemoteConfig, 30000);
    return () => clearInterval(interval);
  }, [fetchRemoteConfig]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--army-red', config.primaryColor);
    root.style.setProperty('--army-gold', config.secondaryColor);
    
    let styleTag = document.getElementById('dynamic-theme-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-theme-styles';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      .mil-grid-bg { opacity: ${config.gridOpacity} !important; }
      .bg-primary { background-color: ${config.primaryColor} !important; }
      .text-primary { color: ${config.primaryColor} !important; }
    `;
    localStorage.setItem('vms_theme_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const saveConfigToCloud = async () => {
    if (!api.getConfig().baseUrl) {
      alert("Chưa cấu hình API. Dữ liệu chỉ được lưu tạm thời trên máy này.");
      return;
    }
    setIsSyncing(true);
    try {
      await api.request('settings/global_config', {
        method: 'PUT',
        body: JSON.stringify(config)
      });
      alert("Đã đồng bộ giao diện lên Cloud thành công!");
    } catch (e) {
      alert("Lỗi đồng bộ Cloud. Vui lòng kiểm tra API Endpoint.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ config, updateConfig, saveConfigToCloud, isSyncing }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
