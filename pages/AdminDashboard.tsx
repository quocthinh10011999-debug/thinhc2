
import React, { useState } from 'react';
import { 
  Users, Calendar, MessageSquare, ShieldCheck, 
  TrendingUp, Activity, AlertCircle, ArrowUpRight,
  RefreshCw, Database, Download, FileJson, FileCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

const AdminDashboard = () => {
  const { registrations, feedbacks, ideologyLogs, lastSync, isLoading, isApiConfigured } = useData();
  const [isExporting, setIsExporting] = useState(false);

  const exportSQL = () => {
    setIsExporting(true);
    try {
      let sqlContent = `-- HỆ THỐNG VMS - DỮ LIỆU ĐỒNG BỘ ĐƠN VỊ\n`;
      sqlContent += `-- Ngày xuất: ${new Date().toLocaleString('vi-VN')}\n\n`;

      // 1. Export Ideology Logs
      sqlContent += `-- Bảng: ideology_logs (Công tác tư tưởng)\n`;
      sqlContent += `CREATE TABLE IF NOT EXISTS ideology_logs (id SERIAL PRIMARY KEY, soldier_name TEXT, rank TEXT, position TEXT, hometown TEXT, squad TEXT, platoon TEXT, soldier_unit TEXT, status TEXT, description TEXT, family_context TEXT, officer_note TEXT, updated_at TIMESTAMP);\n`;
      
      ideologyLogs.forEach(log => {
        sqlContent += `INSERT INTO ideology_logs (soldier_name, rank, position, hometown, squad, platoon, soldier_unit, status, description, family_context, officer_note) VALUES ('${log.soldierName}', '${log.rank}', '${log.position}', '${log.hometown}', '${log.squad}', '${log.platoon}', '${log.soldierUnit}', '${log.status}', '${log.description?.replace(/'/g, "''")}', '${log.familyContext?.replace(/'/g, "''")}', '${log.officerNote?.replace(/'/g, "''")}');\n`;
      });

      sqlContent += `\n-- Bảng: registrations (Đăng ký thăm)\n`;
      registrations.forEach(reg => {
        sqlContent += `INSERT INTO registrations (visitor_name, id_number, phone_number, soldier_name, soldier_unit, relationship, visit_date, visit_time, status) VALUES ('${reg.visitorName}', '${reg.idNumber}', '${reg.phoneNumber}', '${reg.soldierName}', '${reg.soldierUnit}', '${reg.relationship}', '${reg.visitDate}', '${reg.visitTime}', '${reg.status}');\n`;
      });

      const blob = new Blob([sqlContent], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VMS_Export_Backup_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const recentRegs = registrations.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Trung tâm Chỉ huy</h1>
          <p className="text-xs text-slate-500 font-medium flex items-center">
            {isLoading ? (
              <><RefreshCw className="w-3 h-3 mr-2 animate-spin" /> Đang đồng bộ PostgreSQL...</>
            ) : (
              <>Lần cuối đồng bộ: {lastSync?.toLocaleTimeString()}</>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={exportSQL}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-lg transition-all shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Xuất file .SQL</span>
          </button>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${isApiConfigured ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <Database className={`w-3 h-3 ${isApiConfigured ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{isApiConfigured ? 'Postgres Active' : 'SQL Error'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Tổng lượt đăng ký" value={registrations.length} icon={Calendar} color="bg-[#800000]" />
        <StatCard label="Ý kiến đóng góp" value={feedbacks.length} icon={MessageSquare} color="bg-[#d4af37]" />
        <StatCard label="Hồ sơ quân nhân" value={ideologyLogs.length} icon={Users} color="bg-green-500" />
        <StatCard label="Đơn vị quản lý" value="4" icon={Activity} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Đăng ký Thăm hỏi Mới nhất</h3>
            <Link to="/admin/registrations" className="text-[#800000] text-[10px] font-bold uppercase flex items-center hover:underline">
              Quản lý tất cả <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentRegs.length > 0 ? (
              recentRegs.map((reg, i) => (
                <div key={reg.id || i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 group hover:border-[#800000] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#800000] text-[#d4af37] flex items-center justify-center font-bold">
                        {reg.visitorName?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">{reg.visitorName}</p>
                      <p className="text-[10px] text-slate-500">Thăm chiến sĩ: {reg.soldierName} • {reg.soldierUnit}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase ${
                    reg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {reg.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">Chưa có đơn đăng ký nào</div>
            )}
          </div>
        </div>

        <div className="bg-[#800000] text-white rounded-xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-[#d4af37] text-xs font-black uppercase tracking-[0.2em]">Quản trị Dữ liệu</h3>
            <div className="space-y-4">
               <div className="flex items-start space-x-3 bg-black/20 p-4 rounded-lg">
                  <Database className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">Sử dụng tệp .SQL để import vào MySQL hoặc PostgreSQL để sửa dữ liệu hàng loạt.</p>
               </div>
               <button 
                  onClick={exportSQL}
                  className="w-full flex items-center justify-center space-x-2 bg-[#d4af37] text-[#800000] py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded"
               >
                  <Download className="w-4 h-4" />
                  <span>Tải Backup SQL</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
