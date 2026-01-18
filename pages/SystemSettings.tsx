
import React, { useState } from 'react';
import { 
  Settings, Palette, Shield, CloudSync, Layout, 
  Image as ImageIcon, Type, FileText, History, 
  Save, RefreshCw, Plus, Trash2, Globe
} from 'lucide-react';
import { useTheme, RegulationSection, Milestone } from '../context/ThemeContext';

const SettingInput = ({ label, name, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg focus:border-[#800000] outline-none transition-all" 
    />
  </div>
);

const SystemSettings = () => {
  const { config, updateConfig, saveConfigToCloud, isSyncing } = useTheme();
  const [activeTab, setActiveTab] = useState('home');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateConfig({ [name]: value });
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...config.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    updateConfig({ milestones: newMilestones });
  };

  const addMilestone = () => {
    updateConfig({ milestones: [...config.milestones, { year: "2024", title: "Sự kiện mới", desc: "", img: "" }] });
  };

  const removeMilestone = (index: number) => {
    updateConfig({ milestones: config.milestones.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cấu hình Giao diện & Nội dung</h1>
          <p className="text-xs text-slate-500 font-medium">Chỉnh sửa toàn bộ website từ ảnh đến chữ và đồng bộ Cloud.</p>
        </div>
        <button 
          onClick={saveConfigToCloud}
          disabled={isSyncing}
          className="bg-[#800000] text-[#d4af37] px-8 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center space-x-3 disabled:opacity-50"
        >
          {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Lưu & Đồng bộ Cloud</span>
        </button>
      </div>

      <div className="flex space-x-4 border-b border-slate-100 pb-4">
        {[
          { id: 'home', label: 'Trang chủ', icon: Layout },
          { id: 'reg', label: 'Quy định', icon: FileText },
          { id: 'trad', label: 'Truyền thống', icon: History },
          { id: 'general', label: 'Header/Footer', icon: Globe },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-[#800000] text-[#800000]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8 animate-subtle">
          
          {activeTab === 'home' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
              <h3 className="text-[11px] font-black text-[#800000] uppercase tracking-[0.3em] flex items-center">
                <Layout className="w-4 h-4 mr-3" /> Nội dung Trang Chủ
              </h3>
              <div className="space-y-6">
                <SettingInput label="Tiêu đề Hero" name="homeHeroTitle" value={config.homeHeroTitle} onChange={handleInputChange} />
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mô tả Hero</label>
                  <textarea name="homeHeroSubTitle" value={config.homeHeroSubTitle} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg h-24 outline-none" />
                </div>
                <SettingInput label="URL Ảnh nền Hero" name="homeHeroBg" value={config.homeHeroBg} onChange={handleInputChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                  <SettingInput label="Câu trích dẫn (Quote)" name="homeQuote" value={config.homeQuote} onChange={handleInputChange} />
                  <SettingInput label="Tác giả Quote" name="homeQuoteAuthor" value={config.homeQuoteAuthor} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trad' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-[#800000] uppercase tracking-[0.3em] flex items-center">
                    <History className="w-4 h-4 mr-3" /> Mốc son Truyền thống
                  </h3>
                  <button onClick={addMilestone} className="text-[10px] font-bold text-green-600 flex items-center hover:bg-green-50 px-3 py-1 rounded">
                    <Plus className="w-3 h-3 mr-1" /> Thêm mốc mới
                  </button>
               </div>
               <div className="space-y-8">
                  {config.milestones.map((m, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-xl space-y-4 relative group">
                      <button onClick={() => removeMilestone(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                          <SettingInput label="Năm" value={m.year} onChange={(e: any) => updateMilestone(idx, 'year', e.target.value)} />
                        </div>
                        <div className="col-span-3">
                          <SettingInput label="Tiêu đề sự kiện" value={m.title} onChange={(e: any) => updateMilestone(idx, 'title', e.target.value)} />
                        </div>
                      </div>
                      <textarea placeholder="Mô tả sự kiện..." value={m.desc} onChange={(e: any) => updateMilestone(idx, 'desc', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-medium rounded-lg h-20 outline-none" />
                      <SettingInput label="URL Ảnh tư liệu" value={m.img} onChange={(e: any) => updateMilestone(idx, 'img', e.target.value)} />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
               <h3 className="text-[11px] font-black text-[#800000] uppercase tracking-[0.3em] flex items-center">
                <Globe className="w-4 h-4 mr-3" /> Thông tin Đơn vị & Chân trang
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingInput label="Tên đơn vị chính" name="unitName" value={config.unitName} onChange={handleInputChange} />
                <SettingInput label="Phân cấp đơn vị" name="unitSubName" value={config.unitSubName} onChange={handleInputChange} />
                <SettingInput label="Slogan đơn vị" name="slogan" value={config.slogan} onChange={handleInputChange} />
                <SettingInput label="Hotline liên hệ" name="contactPhone" value={config.contactPhone} onChange={handleInputChange} />
                <div className="md:col-span-2">
                  <SettingInput label="Địa chỉ đóng quân" name="contactAddress" value={config.contactAddress} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <SettingInput label="Copyright Footer" name="footerCopyright" value={config.footerCopyright} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#800000] rounded-xl p-8 text-white shadow-xl">
               <Shield className="w-10 h-10 text-[#d4af37] mb-6" />
               <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37] mb-4">Ghi chú vận hành</h4>
               <p className="text-[10px] leading-relaxed text-white/70 italic">
                 Mọi thay đổi về nội dung sẽ được đồng bộ ngay lập tức tới tất cả các máy tính đang truy cập hệ thống nếu Cloud Sync được kích hoạt.
               </p>
               <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                    <span>Trạng thái Cloud</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                    <span>Phiên bản CMS</span>
                    <span>{config.version}</span>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
