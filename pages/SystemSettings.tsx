
import React, { useState, useRef } from 'react';
import { 
  Settings, Palette, Shield, Cloud, Layout, 
  Image as ImageIcon, Type, FileText, History, 
  Save, RefreshCw, Plus, Trash2, Globe, Upload,
  Pipette, ListPlus, GripVertical, Link as LinkIcon,
  Eye
} from 'lucide-react';
import { useTheme, RegulationSection, Milestone } from '../context/ThemeContext';

const SettingInput = ({ label, name, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg focus:border-[#800000] outline-none transition-all" 
    />
  </div>
);

const ColorInput = ({ label, name, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
    <div className="flex items-center space-x-3">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0">
        <input 
          type="color" 
          name={name} 
          value={value} 
          onChange={onChange}
          className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
        />
      </div>
      <input 
        type="text" 
        name={name} 
        value={value} 
        onChange={onChange}
        className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-mono font-bold rounded-lg focus:border-[#800000] outline-none transition-all uppercase"
      />
    </div>
  </div>
);

// --- COMPONENT CHỌN ẢNH THÔNG MINH (URL & FILE) ---
const TacticalImageUpload = ({ label, value, onImageChange }: { label: string, value: string, onImageChange: (val: string) => void }) => {
  const [mode, setMode] = useState<'link' | 'file'>(value?.startsWith('data:image') ? 'file' : 'link');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
        <div className="flex bg-slate-100 p-1 rounded-md">
          <button 
            onClick={() => setMode('link')}
            className={`px-3 py-1 text-[8px] font-black uppercase rounded ${mode === 'link' ? 'bg-white text-[#800000] shadow-sm' : 'text-slate-400'}`}
          >
            Đường dẫn (URL)
          </button>
          <button 
            onClick={() => setMode('file')}
            className={`px-3 py-1 text-[8px] font-black uppercase rounded ${mode === 'file' ? 'bg-white text-[#800000] shadow-sm' : 'text-slate-400'}`}
          >
            Tải tệp lên
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-300" />
          )}
        </div>
        
        <div className="flex-grow">
          {mode === 'link' ? (
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                value={value?.startsWith('data:image') ? '' : value}
                onChange={(e) => onImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-[12px] font-medium rounded-lg focus:border-[#800000] outline-none"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-[#800000] hover:bg-slate-50 rounded-lg transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Chọn tệp ảnh</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              {value?.startsWith('data:image') && (
                <span className="text-[10px] text-green-600 font-bold uppercase italic">✓ Đã nạp từ máy</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

  const updateRegSectionTitle = (index: number, title: string) => {
    const newRegs = [...config.regSections];
    newRegs[index] = { ...newRegs[index], title };
    updateConfig({ regSections: newRegs });
  };

  const updateRegItem = (sectionIdx: number, itemIdx: number, value: string) => {
    const newRegs = [...config.regSections];
    const newItems = [...newRegs[sectionIdx].items];
    newItems[itemIdx] = value;
    newRegs[sectionIdx] = { ...newRegs[sectionIdx], items: newItems };
    updateConfig({ regSections: newRegs });
  };

  const addRegItem = (sectionIdx: number) => {
    const newRegs = [...config.regSections];
    newRegs[sectionIdx] = { ...newRegs[sectionIdx], items: [...newRegs[sectionIdx].items, "Nội dung quy định mới"] };
    updateConfig({ regSections: newRegs });
  };

  const removeRegItem = (sectionIdx: number, itemIdx: number) => {
    const newRegs = [...config.regSections];
    newRegs[sectionIdx] = { ...newRegs[sectionIdx], items: newRegs[sectionIdx].items.filter((_, i) => i !== itemIdx) };
    updateConfig({ regSections: newRegs });
  };

  const addRegSection = () => {
    updateConfig({ regSections: [...config.regSections, { title: "Chương mới", items: ["Điều 1..."] }] });
  };

  const removeRegSection = (index: number) => {
    updateConfig({ regSections: config.regSections.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cấu hình Giao diện & Nội dung</h1>
          <p className="text-xs text-slate-500 font-medium">Chỉnh sửa website linh hoạt: Hỗ trợ dán link URL hoặc Tải ảnh trực tiếp từ máy tính.</p>
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
          { id: 'general', label: 'Cấu hình chung', icon: Globe },
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
                <TacticalImageUpload 
                  label="Ảnh nền Hero Trang chủ" 
                  value={config.homeHeroBg} 
                  onImageChange={(val) => updateConfig({ homeHeroBg: val })} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                  <SettingInput label="Câu trích dẫn (Quote)" name="homeQuote" value={config.homeQuote} onChange={handleInputChange} />
                  <SettingInput label="Tác giả Quote" name="homeQuoteAuthor" value={config.homeQuoteAuthor} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reg' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-[#800000] uppercase tracking-[0.3em] flex items-center">
                    <FileText className="w-4 h-4 mr-3" /> Nội dung Quy định an ninh
                  </h3>
                  <button onClick={addRegSection} className="text-[10px] font-bold text-green-600 flex items-center hover:bg-green-50 px-3 py-1 rounded">
                    <Plus className="w-3 h-3 mr-1" /> Thêm chương mới
                  </button>
               </div>
               <TacticalImageUpload 
                  label="Ảnh nền Hero Trang Quy định" 
                  value={config.regHeroBg} 
                  onImageChange={(val) => updateConfig({ regHeroBg: val })} 
                />
               <div className="space-y-10 pt-6">
                  {config.regSections.map((section, sIdx) => (
                    <div key={sIdx} className="p-8 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-6 group">
                      <button onClick={() => removeRegSection(sIdx)} className="absolute top-6 right-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="max-w-md">
                        <SettingInput label={`Tiêu đề phần ${sIdx + 1}`} value={section.title} onChange={(e: any) => updateRegSectionTitle(sIdx, e.target.value)} />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Danh sách các điều khoản</label>
                        {section.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center space-x-3">
                            <GripVertical className="w-4 h-4 text-slate-300" />
                            <input 
                              type="text" 
                              value={item} 
                              onChange={(e) => updateRegItem(sIdx, iIdx, e.target.value)}
                              className="flex-grow px-4 py-2 bg-white border border-slate-200 text-xs font-medium rounded outline-none focus:border-[#800000]"
                            />
                            <button onClick={() => removeRegItem(sIdx, iIdx)} className="p-2 text-slate-300 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => addRegItem(sIdx)}
                          className="flex items-center text-[10px] font-bold text-[#800000] hover:underline pt-2"
                        >
                          <ListPlus className="w-4 h-4 mr-2" /> Thêm điều khoản
                        </button>
                      </div>
                    </div>
                  ))}
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
               <TacticalImageUpload 
                  label="Ảnh nền Hero Trang Truyền thống" 
                  value={config.tradHeroBg} 
                  onImageChange={(val) => updateConfig({ tradHeroBg: val })} 
                />
               <div className="space-y-8 pt-6">
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
                      <TacticalImageUpload 
                        label="Ảnh tư liệu sự kiện" 
                        value={m.img} 
                        onImageChange={(val) => updateMilestone(idx, 'img', val)} 
                      />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-12">
              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-[#800000] uppercase tracking-[0.3em] flex items-center">
                  <Globe className="w-4 h-4 mr-3" /> Thiết lập Logo & Màu sắc Thương hiệu
                </h3>
                
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-8">
                  <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10">
                    <div className="space-y-3 shrink-0">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">Xem trước Logo</label>
                      <div className="w-40 h-40 bg-white border-4 border-white shadow-xl rounded-2xl flex items-center justify-center overflow-hidden">
                        {config.logoUrl ? (
                          <img src={config.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2" />
                        ) : (
                          <div className="text-center">
                            <Shield className="w-12 h-12 text-slate-200 mx-auto" />
                            <p className="text-[8px] font-black text-slate-200 uppercase mt-2">Chưa có ảnh</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow w-full space-y-6">
                      <TacticalImageUpload 
                        label="Ảnh Logo đơn vị (URL hoặc Tải tệp)" 
                        value={config.logoUrl} 
                        onImageChange={(val) => updateConfig({ logoUrl: val })} 
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <ColorInput label="Màu chữ chính (Phần 1)" name="logoTextColor1" value={config.logoTextColor1} onChange={handleInputChange} />
                        <ColorInput label="Màu chữ phụ (Phần 2)" name="logoTextColor2" value={config.logoTextColor2} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Mô phỏng hiển thị tiêu đề</label>
                    <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-inner flex items-center space-x-4">
                       <div className="w-12 h-12 bg-[#800000] rounded-lg flex items-center justify-center overflow-hidden">
                          {config.logoUrl ? <img src={config.logoUrl} className="w-full h-full object-contain p-1" /> : <Shield className="w-6 h-6 text-[#d4af37]" />}
                       </div>
                       <div>
                          <p className="text-[20px] font-black uppercase tracking-tight" style={{ color: config.logoTextColor1 }}>
                            {config.unitName.split(' ')[0]} <span style={{ color: config.logoTextColor2 }}>{config.unitName.split(' ').slice(1).join(' ')}</span>
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{config.unitSubName}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 pt-8 border-t border-slate-100">
                <h3 className="text-[11px] font-black text-[#800000] uppercase tracking-[0.3em] flex items-center">
                  <FileText className="w-4 h-4 mr-3" /> Thông tin đơn vị & Chân trang
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <ColorInput label="Màu chủ đạo (Primary)" name="primaryColor" value={config.primaryColor} onChange={handleInputChange} />
                  <ColorInput label="Màu phụ trợ (Secondary)" name="secondaryColor" value={config.secondaryColor} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#800000] rounded-xl p-8 text-white shadow-xl">
               <Pipette className="w-10 h-10 text-[#d4af37] mb-6" />
               <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37] mb-4">Ghi chú thiết kế</h4>
               <p className="text-[10px] leading-relaxed text-white/70 italic">
                 Hệ thống hiện hỗ trợ cả tải ảnh trực tiếp (Base64) hoặc dán link URL. 
                 Màu sắc chữ logo và nền sẽ được cập nhật ngay lập tức sau khi lưu dữ liệu.
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
