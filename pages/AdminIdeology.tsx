
import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, Plus, Search, Filter, 
  AlertTriangle, CheckCircle2, Info, 
  ShieldAlert, History, User, Save, X, 
  Loader2, RefreshCw, BarChart3, PieChart,
  LayoutGrid, Activity, ChevronRight,
  ShieldCheck, Zap, Crosshair, Target
} from 'lucide-react';
import { useData } from '../context/DataContext';

const AdminIdeology = () => {
  const { ideologyLogs, addIdeologyLog, isLoading, lastSync } = useData();
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newLog, setNewLog] = useState({
    soldierName: '',
    soldierUnit: 'Đại đội 1' as string,
    status: 'stable' as 'stable' | 'concern' | 'urgent',
    description: '',
    familyContext: '',
    officerNote: ''
  });

  // --- HỆ THỐNG ĐƠN VỊ CHIẾN LƯỢC ---
  const MILITARY_UNITS = ['Đại đội 1', 'Đại đội 2', 'Đại đội 3', 'Tiểu đoàn bộ'];

  const stats = useMemo(() => {
    const total = ideologyLogs.length || 1;
    const stable = ideologyLogs.filter(l => l.status === 'stable').length;
    const concern = ideologyLogs.filter(l => l.status === 'concern').length;
    const urgent = ideologyLogs.filter(l => l.status === 'urgent').length;

    const unitData = MILITARY_UNITS.map(u => {
      const unitLogs = ideologyLogs.filter(l => l.soldierUnit === u);
      const uTotal = unitLogs.length || 0;
      const uUrgent = unitLogs.filter(l => l.status === 'urgent').length;
      const uConcern = unitLogs.filter(l => l.status === 'concern').length;
      
      // Tính toán "Chỉ số ổn định" (Health Score)
      const healthScore = uTotal === 0 ? 100 : Math.max(0, 100 - (uUrgent * 40 + uConcern * 15));
      
      return {
        name: u,
        count: uTotal,
        urgent: uUrgent,
        concern: uConcern,
        healthScore
      };
    });

    return { 
      total: ideologyLogs.length, 
      stable, concern, urgent, 
      stablePct: (stable / total) * 100,
      concernPct: (concern / total) * 100,
      urgentPct: (urgent / total) * 100,
      unitData
    };
  }, [ideologyLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addIdeologyLog(newLog);
      setShowForm(false);
      setNewLog({
        soldierName: '',
        soldierUnit: 'Đại đội 1',
        status: 'stable',
        description: '',
        familyContext: '',
        officerNote: ''
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'concern': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-200 pb-8 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-[#800000] rounded shadow-[0_0_15px_rgba(128,0,0,0.3)]">
                <BrainCircuit className="w-6 h-6 text-[#d4af37]" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Bảng Chỉ huy Tư tưởng chiến lược</h1>
          </div>
          <div className="flex items-center space-x-4">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center">
                <Activity className="w-3 h-3 mr-2 text-green-500" />
                Dữ liệu đồng bộ: {lastSync?.toLocaleTimeString()}
             </p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="group relative bg-[#800000] text-[#d4af37] px-8 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center space-x-3 overflow-hidden"
        >
          <div className="absolute inset-0 w-1/4 h-full bg-white/10 -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700"></div>
          <Zap className="w-4 h-4 animate-pulse" />
          <span>Báo cáo diễn biến mới</span>
        </button>
      </div>

      {/* STRATEGIC UNIT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.unitData.map((unit, idx) => (
          <div key={idx} className={`relative bg-white border-2 p-6 transition-all duration-500 ${unit.urgent > 0 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-slate-100 shadow-sm'}`}>
            {/* Health Meter Background */}
            <div className="absolute inset-0 bg-slate-50/50 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#800000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">{unit.name}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Active</p>
                </div>
                <div className={`p-2 rounded ${unit.healthScore > 80 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <Target className="w-4 h-4" />
                </div>
              </div>

              {/* Tactical Gauge */}
              <div className="relative pt-6 flex flex-col items-center">
                <div className="relative w-24 h-12 overflow-hidden">
                   <div className="absolute w-24 h-24 border-[10px] border-slate-100 rounded-full"></div>
                   <div 
                      className={`absolute w-24 h-24 border-[10px] rounded-full transition-all duration-1000 rotate-[45deg] ${unit.healthScore > 80 ? 'border-green-500' : unit.healthScore > 50 ? 'border-amber-500' : 'border-red-500'}`}
                      style={{ 
                        clipPath: `polygon(0 0, 100% 0, 100% 50%, 0 50%)`,
                        transform: `rotate(${45 + (unit.healthScore / 100 * 180)}deg)`
                      }}
                   ></div>
                </div>
                <div className="text-xl font-black text-slate-900 mt-2">{Math.round(unit.healthScore)}%</div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Chỉ số ổn định</div>
              </div>

              {/* Unit Indicators */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50">
                <div className="bg-slate-50 p-2 rounded text-center">
                  <span className="block text-[8px] font-bold text-slate-400 uppercase">Hồ sơ</span>
                  <span className="text-xs font-black text-slate-900">{unit.count}</span>
                </div>
                <div className={`p-2 rounded text-center ${unit.urgent > 0 ? 'bg-red-50 animate-pulse' : 'bg-slate-50'}`}>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase">Cấp bách</span>
                  <span className={`text-xs font-black ${unit.urgent > 0 ? 'text-red-600' : 'text-slate-900'}`}>{unit.urgent}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Analytics Table */}
        <div className="lg:col-span-8 bg-white border-2 border-[#800000] shadow-xl overflow-hidden">
          <div className="px-8 py-5 bg-[#800000] border-b border-[#d4af37] flex justify-between items-center text-[#d4af37]">
            <div className="flex items-center space-x-4">
              <Crosshair className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cơ sở dữ liệu tư tưởng</span>
            </div>
            <div className="flex space-x-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Chiến sĩ</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Đơn vị</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Ngày cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ideologyLogs.length > 0 ? ideologyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-[#800000] rounded group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{log.soldierName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[200px]">{log.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[10px] font-black text-[#800000] bg-red-50 px-3 py-1 rounded border border-red-100 uppercase">
                        {log.soldierUnit}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`px-4 py-1.5 rounded text-[9px] font-black uppercase flex items-center space-x-2 inline-flex border ${getStatusStyle(log.status)} shadow-sm`}>
                        {log.status === 'urgent' ? <ShieldAlert className="w-3 h-3" /> : log.status === 'concern' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{log.status === 'urgent' ? 'Cấp bách' : log.status === 'concern' ? 'Chú ý' : 'Ổn định'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="text-[10px] font-mono font-bold text-slate-400 italic">
                        {log.lastUpdated || (log as any).updatedAt?.toDate().toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center opacity-30">
                      <RefreshCw className="w-12 h-12 mx-auto animate-spin mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Hệ thống đang chờ lệnh...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Distribution HUD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-slate-100 p-8 shadow-sm flex flex-col items-center">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center">Cấu trúc Tư tưởng chung</h3>
             <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#dc2626" strokeWidth="4" 
                    strokeDasharray={`${stats.urgentPct} ${100 - stats.urgentPct}`} strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" 
                    strokeDasharray={`${stats.concernPct} ${100 - stats.concernPct}`} strokeDashoffset={-stats.urgentPct} />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#16a34a" strokeWidth="4" 
                    strokeDasharray={`${stats.stablePct} ${100 - stats.stablePct}`} strokeDashoffset={-(stats.urgentPct + stats.concernPct)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{stats.total}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Dữ liệu</span>
                </div>
             </div>
             <div className="mt-8 grid grid-cols-1 w-full gap-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase p-2 bg-green-50 rounded">
                   <span className="text-green-600">Ổn định</span>
                   <span>{Math.round(stats.stablePct)}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase p-2 bg-amber-50 rounded">
                   <span className="text-amber-500">Cần chú ý</span>
                   <span>{Math.round(stats.concernPct)}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase p-2 bg-red-50 rounded">
                   <span className="text-red-600">Cấp bách</span>
                   <span>{Math.round(stats.urgentPct)}%</span>
                </div>
             </div>
          </div>

          <div className="bg-[#800000] p-8 text-[#d4af37] shadow-xl space-y-6">
             <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Khuyến nghị Tác chiến</h4>
             </div>
             <p className="text-[10px] leading-relaxed italic opacity-80 border-l-2 border-[#d4af37] pl-4">
               {stats.urgent > 0 
                ? `Cảnh báo! Có ${stats.urgent} trường hợp cần xử lý ngay lập tức tại đơn vị. Yêu cầu Chính trị viên Tiểu đoàn xuống cơ sở.` 
                : "Tình hình tư tưởng toàn tiểu đoàn đang duy trì ở mức ổn định. Tiếp tục duy trì chế độ đối thoại dân chủ."}
             </p>
          </div>
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl shadow-2xl animate-subtle border-t-[12px] border-[#800000]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-[#800000] uppercase text-lg tracking-tight flex items-center">
                  <Zap className="w-5 h-5 mr-3" /> Phiếu ghi nhận tác chiến tư tưởng
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Đơn vị: Tiểu đoàn 15 SPG-9</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-red-500 hover:text-white transition-all rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Họ tên quân nhân</label>
                  <input required value={newLog.soldierName} onChange={e => setNewLog({...newLog, soldierName: e.target.value.toUpperCase()})} placeholder="NGUYỄN VĂN A" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Đơn vị tiếp nhận</label>
                  <select 
                    value={newLog.soldierUnit} 
                    onChange={e => setNewLog({...newLog, soldierUnit: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black transition-all"
                  >
                    {MILITARY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mức độ cảnh báo</label>
                <div className="grid grid-cols-3 gap-4">
                  {['stable', 'concern', 'urgent'].map(s => (
                    <button 
                      key={s} type="button" 
                      onClick={() => setNewLog({...newLog, status: s as any})}
                      className={`py-4 text-[10px] font-black uppercase border-2 transition-all ${newLog.status === s ? 'bg-[#800000] text-white border-[#800000] shadow-lg scale-105' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                    >
                      {s === 'stable' ? 'Ổn định' : s === 'concern' ? 'Chú ý' : 'Cấp bách'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nội dung nắm bắt</label>
                <textarea required value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})} placeholder="Diễn biến tâm lý, biểu hiện cụ thể..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-medium h-24" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Biến động Hậu phương</label>
                  <input value={newLog.familyContext} onChange={e => setNewLog({...newLog, familyContext: e.target.value})} placeholder="Hoàn cảnh gia đình..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Đề xuất xử lý</label>
                  <input value={newLog.officerNote} onChange={e => setNewLog({...newLog, officerNote: e.target.value})} placeholder="Hướng giải quyết..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm font-bold italic" />
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-8 py-5 border-2 border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  disabled={isSaving}
                  className="flex-[2] bg-[#800000] text-[#d4af37] py-5 font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-4 shadow-2xl hover:bg-black transition-all"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>{isSaving ? 'ĐANG LƯU...' : 'LƯU HỒ SƠ TÁC CHIẾN'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIdeology;
