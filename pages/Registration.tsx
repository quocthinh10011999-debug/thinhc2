
import React, { useState } from 'react';
import { ShieldCheck, User, Phone, Calendar, Users, MapPin, Clock, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegistrationData } from '../types';
import { api } from '../services/api';
import { useData } from '../context/DataContext';

const InputBlock = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
        {label} {props.required && <span className="text-[#800000]">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37] group-focus-within:text-[#800000] transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <input 
        {...props}
        className="w-full pl-12 pr-4 py-3 text-sm font-medium bg-slate-50 border border-slate-200 focus:border-[#800000] focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-300" 
      />
    </div>
  </div>
);

const Registration = () => {
  const { refreshData } = useData();
  const [formData, setFormData] = useState<RegistrationData>({
    visitorName: '',
    idNumber: '',
    phoneNumber: '',
    soldierName: '',
    soldierUnit: '',
    relationship: '',
    visitDate: '',
    visitTime: '08:00',
  });

  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const id = `15-X${Date.now().toString().slice(-5)}`;
      const newEntry = {
        ...formData,
        id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await api.createRegistration(newEntry);
      await refreshData(); // Đồng bộ lại dữ liệu toàn cục

      setRegId(id);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      alert("Lỗi khi gửi hồ sơ. Vui lòng kiểm tra kết nối mạng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fffcf5] flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full bg-white border-4 border-[#800000] p-12 shadow-heavy text-center space-y-10">
            <div className="w-16 h-16 bg-[#800000] text-[#d4af37] flex items-center justify-center mx-auto shadow-lg">
                <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-3">
                <h2 className="text-2xl font-black text-[#800000] uppercase tracking-tight">Gửi hồ sơ thành công</h2>
                <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                  Hồ sơ đã được gửi lên hệ thống và đang chờ phê duyệt từ ban chỉ huy.
                </p>
            </div>
            <div className="py-6 px-4 bg-slate-50 border-l-8 border-[#d4af37]">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Mã số phê duyệt</p>
                <span className="text-3xl font-black text-[#800000] font-mono tracking-wider">{regId}</span>
            </div>
            <div className="pt-4 flex flex-col gap-3">
                <Link to="/" className="bg-[#800000] text-[#d4af37] py-3.5 font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all">Quay lại trang chủ</Link>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf5] py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border-2 border-[#d4af37] shadow-sm overflow-hidden">
            <div className="bg-[#800000] p-10 text-white relative">
                <h1 className="text-3xl font-black uppercase tracking-tight relative z-10">Tờ khai điện tử</h1>
                <p className="text-[#d4af37] text-[13px] mt-2 relative z-10 font-bold uppercase tracking-widest opacity-80">Battalion 15 • Digital Gateway</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-12">
                <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-1 bg-[#800000]"></div>
                        <h3 className="text-xs font-bold text-[#800000] uppercase tracking-widest">Phần I: Thông tin thân nhân</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputBlock icon={User} label="Họ tên người thăm" required value={formData.visitorName} onChange={(e: any) => setFormData({...formData, visitorName: e.target.value})} />
                        <InputBlock icon={Phone} label="Số điện thoại" required value={formData.phoneNumber} onChange={(e: any) => setFormData({...formData, phoneNumber: e.target.value})} />
                        <InputBlock icon={FileText} label="Số CCCD" required value={formData.idNumber} onChange={(e: any) => setFormData({...formData, idNumber: e.target.value})} />
                        <InputBlock icon={MapPin} label="Mối quan hệ" required value={formData.relationship} onChange={(e: any) => setFormData({...formData, relationship: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-1 bg-[#d4af37]"></div>
                        <h3 className="text-xs font-bold text-[#800000] uppercase tracking-widest">Phần II: Thông tin quân nhân</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputBlock icon={Users} label="Họ tên chiến sĩ" required value={formData.soldierName} onChange={(e: any) => setFormData({...formData, soldierName: e.target.value})} />
                        <InputBlock icon={FileText} label="Đơn vị (Đại đội)" required value={formData.soldierUnit} onChange={(e: any) => setFormData({...formData, soldierUnit: e.target.value})} />
                        <InputBlock icon={Calendar} label="Ngày thăm" type="date" required value={formData.visitDate} onChange={(e: any) => setFormData({...formData, visitDate: e.target.value})} />
                        <InputBlock icon={Clock} label="Giờ dự kiến" type="time" required value={formData.visitTime} onChange={(e: any) => setFormData({...formData, visitTime: e.target.value})} />
                    </div>
                </div>

                <div className="bg-amber-50 p-6 border-l-8 border-[#800000] flex items-start space-x-4">
                    <AlertTriangle className="w-5 h-5 text-[#800000] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#800000] font-bold leading-relaxed uppercase tracking-wide">
                        Mọi thông tin sẽ được đối soát thực tế tại cổng gác. Khai báo sai sẽ bị từ chối truy cập.
                    </p>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#800000] text-[#d4af37] px-12 py-4 font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all flex items-center space-x-3 shadow-lg disabled:opacity-50"
                    >
                        <span>{isSubmitting ? 'ĐANG GỬI...' : 'GỬI HỒ SƠ ĐĂNG KÝ'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
