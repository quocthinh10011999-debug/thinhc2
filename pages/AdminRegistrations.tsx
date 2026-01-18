
import React from 'react';
import { 
  CheckCircle, XCircle, Search, Calendar, Shield, Phone, 
  Clock, Trash2, RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';

const AdminRegistrations = () => {
  const { registrations, updateRegStatus, isLoading, lastSync } = useData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Quản lý Đăng ký Thăm</h1>
          <p className="text-xs text-slate-500 font-medium flex items-center">
            {isLoading ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : null}
            Danh sách thân nhân đăng ký ra vào doanh trại. Cập nhật: {lastSync?.toLocaleTimeString()}
          </p>
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
              {registrations.length > 0 ? registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
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
                        <Calendar className="w-3 h-3 mr-2" /> {reg.visitDate}
                      </div>
                      <div className="flex items-center text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3 mr-2" /> {reg.visitTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${
                      reg.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      reg.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
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
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all rounded" title="Duyệt"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateRegStatus(reg.id, 'rejected')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded" title="Từ chối"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    Chưa có dữ liệu đăng ký trong hệ thống
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;
