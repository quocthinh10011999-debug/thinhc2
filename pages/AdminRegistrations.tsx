
import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, Search, Calendar, Shield, Phone, 
  Clock, Trash2, RefreshCw, Filter, Download
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { api } from '../services/api';

const AdminRegistrations = () => {
  const { registrations, updateRegStatus, refreshData, isLoading, lastSync } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string) => {
    if (window.confirm('Xác nhận xóa hồ sơ đăng ký này khỏi cơ sở dữ liệu?')) {
      await api.deleteRegistration(id);
      await refreshData();
    }
  };

  const filtered = registrations.filter(r => 
    r.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.soldierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Quản lý Đăng ký Thăm</h1>
          <p className="text-xs text-slate-500 font-medium flex items-center">
             Cơ sở dữ liệu: Neon Postgres • Cập nhật: {lastSync?.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
           <div className="relative flex-grow md:flex-grow-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm tên thân nhân/chiến sĩ..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-[#800000] w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button onClick={() => refreshData()} className={`p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all ${isLoading ? 'animate-spin' : ''}`}>
              <RefreshCw className="w-4 h-4 text-slate-600" />
           </button>
        </div>
      </div>

      <div className="bg-white border-2 border-[#800000] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#800000] text-[#d4af37] border-b border-[#d4af37]/20">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Thân nhân</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Chiến sĩ</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Thời gian</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 uppercase">{reg.visitorName}</p>
                      <div className="flex items-center space-x-2 text-[9px] text-slate-400 font-bold">
                        <Shield className="w-3 h-3" /> <span>{reg.idNumber}</span>
                        <Phone className="w-3 h-3 ml-2" /> <span>{reg.phoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#800000] uppercase">{reg.soldierName}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{reg.soldierUnit}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center text-[10px] font-bold text-slate-600">
                        <Calendar className="w-3 h-3 mr-2 text-[#800000]" /> {reg.visitDate}
                      </div>
                      <div className="flex items-center text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3 mr-2" /> {reg.visitTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase border ${
                      reg.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                      reg.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {reg.status === 'approved' ? 'Đã duyệt' : 
                       reg.status === 'rejected' ? 'Từ chối' : 
                       'Đang chờ'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end space-x-2">
                      {reg.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateRegStatus(reg.id, 'approved')}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all rounded shadow-sm" title="Duyệt hồ sơ"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateRegStatus(reg.id, 'rejected')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded shadow-sm" title="Từ chối hồ sơ"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(reg.id)}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all rounded" title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : 'Chưa có dữ liệu đăng ký trong hệ thống'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-slate-50 p-6 border-l-4 border-[#d4af37] flex items-center justify-between">
         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hệ thống lưu trữ tập trung PostgreSQL • Bảo mật theo quy định Bộ Quốc Phòng</p>
         <button className="flex items-center space-x-2 text-[10px] font-black uppercase text-[#800000] hover:underline">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo (Excel)</span>
         </button>
      </div>
    </div>
  );
};

export default AdminRegistrations;
