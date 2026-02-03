
import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, Search, AlertCircle, CheckCircle2, 
  User, Save, X, Loader2, Activity, ShieldCheck, 
  Zap, Crosshair, Award, ListChecks, BookOpen, 
  ShieldQuestion, Pencil, Trash2, ChevronDown, 
  Users, MapPin, Star, Download
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { IdeologyLog } from '../types';

const AdminIdeology = () => {
  const { ideologyLogs, addIdeologyLog, updateIdeologyLog, deleteIdeologyLog, lastSync } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLog, setEditingLog] = useState<IdeologyLog | null>(null);
  
  const [newLog, setNewLog] = useState({
    soldierName: '',
    rank: 'Binh nhì',
    position: 'Chiến sĩ',
    hometown: '',
    squad: 'Khẩu đội 1',
    platoon: 'Trung đội 1',
    soldierUnit: 'Đại đội 1',
    status: 'tốt' as 'tốt' | 'khá' | 'trung bình',
    description: '',
    familyContext: '',
    officerNote: ''
  });

  const MILITARY_UNITS = ['Đại đội 1', 'Đại đội 2', 'Đại đội 3', 'Tiểu đoàn bộ'];
  const RANKS = ['Binh nhì', 'Binh nhất', 'Hạ sĩ', 'Trung sĩ', 'Thượng sĩ'];
  const POSITIONS = ['Chiến sĩ', 'Khẩu đội trưởng', 'Trung đội phó', 'Trung đội trưởng', 'BTV Đại đội'];
  const SQUADS = ['Khẩu đội 1', 'Khẩu đội 2', 'Khẩu đội 3', 'Bộ phận lẻ'];
  const PLATOONS = ['Trung đội 1', 'Trung đội 2', 'Trung đội 3', 'Bộ phận trực thuộc'];

  const stats = useMemo(() => {
    const total = ideologyLogs.length || 1;
    const tot = ideologyLogs.filter(l => l.status === 'tốt' || l.status === 'stable').length;
    const kha = ideologyLogs.filter(l => l.status === 'khá' || l.status === 'concern').length;
    const trungbinh = ideologyLogs.filter(l => l.status === 'trung bình' || l.status === 'urgent').length;

    const unitData = MILITARY_UNITS.map(u => {
      const unitLogs = ideologyLogs.filter(l => l.soldierUnit === u);
      const uTotal = unitLogs.length || 0;
      const uTot = unitLogs.filter(l => l.status === 'tốt' || l.status === 'stable').length;
      const uKha = unitLogs.filter(l => l.status === 'khá' || l.status === 'concern').length;
      const uTrungBinh = unitLogs.filter(l => l.status === 'trung bình' || l.status === 'urgent').length;
      const healthScore = uTotal === 0 ? 100 : Math.max(0, 100 - (uTrungBinh * 40 + uKha * 15));
      return { 
        name: u, 
        count: uTotal, tot: uTot, kha: uKha, trungbinh: uTrungBinh, healthScore,
        totPct: uTotal > 0 ? (uTot / uTotal) * 100 : 0,
        khaPct: uTotal > 0 ? (uKha / uTotal) * 100 : 0,
        tbPct: uTotal > 0 ? (uTrungBinh / uTotal) * 100 : 0
      };
    });

    return { total: ideologyLogs.length, tot, kha, trungbinh, totPct: (tot / total) * 100, khaPct: (kha / total) * 100, trungbinhPct: (trungbinh / total) * 100, unitData };
  }, [ideologyLogs]);

  const exportCSV = () => {
    let csv = "Ho ten,Cap bac,Chuc vu,Que quan,Khau doi,Trung doi,Dai doi,Phan loai,Noi dung\n";
    ideologyLogs.forEach(l => {
      csv += `"${l.soldierName}","${l.rank}","${l.position}","${l.hometown}","${l.squad}","${l.platoon}","${l.soldierUnit}","${l.status}","${l.description?.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DS_TuTuong_QuanNhan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = ideologyLogs.filter(log => {
    const s = searchTerm.toLowerCase();
    const nameMatch = log.soldierName.toLowerCase().includes(s);
    const unitMatch = log.soldierUnit.toLowerCase().includes(s);
    const posMatch = log.position?.toLowerCase().includes(s);
    const hometownMatch = log.hometown?.toLowerCase().includes(s);
    const matchesSearch = nameMatch || unitMatch || posMatch || hometownMatch;
    const logStatus = (log.status === 'stable' ? 'tốt' : log.status === 'concern' ? 'khá' : log.status === 'urgent' ? 'trung bình' : log.status).toLowerCase();
    return matchesSearch && (filterStatus === 'all' || logStatus === filterStatus);
  });

  const handleOpenCreate = () => {
    setEditingLog(null);
    setNewLog({ soldierName: '', rank: 'Binh nhì', position: 'Chiến sĩ', hometown: '', squad: 'Khẩu đội 1', platoon: 'Trung đội 1', soldierUnit: 'Đại đội 1', status: 'tốt', description: '', familyContext: '', officerNote: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (log: IdeologyLog) => {
    setEditingLog(log);
    setNewLog({
      soldierName: log.soldierName,
      rank: log.rank || 'Binh nhì',
      position: log.position || 'Chiến sĩ',
      hometown: log.hometown || '',
      squad: log.squad || 'Khẩu đội 1',
      platoon: log.platoon || 'Trung đội 1',
      soldierUnit: log.soldierUnit,
      status: (log.status === 'stable' ? 'tốt' : log.status === 'concern' ? 'khá' : log.status === 'urgent' ? 'trung bình' : log.status) as any,
      description: log.description,
      familyContext: log.familyContext,
      officerNote: log.officerNote
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingLog) await updateIdeologyLog(editingLog.id, newLog);
      else await addIdeologyLog(newLog);
      setShowForm(false);
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-200 pb-8 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-[#800000] rounded shadow-[0_0_15px_rgba(128,0,0,0.3)]">
                <BrainCircuit className="w-6 h-6 text-[#d4af37]" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Công tác Tư tưởng Quân sự</h1>
          </div>
          <div className="flex items-center space-x-6">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center">
                <Activity className="w-3 h-3 mr-2 text-green-500" /> Đồng bộ Neon SQL: {lastSync?.toLocaleTimeString()}
            </p>
            <button onClick={exportCSV} className="text-[10px] text-[#800000] font-black uppercase tracking-widest flex items-center hover:bg-red-50 px-3 py-1 rounded transition-colors">
                <Download className="w-3.5 h-3.5 mr-1.5" /> Xuất dữ liệu CSV
            </button>
          </div>
        </div>
        <button onClick={handleOpenCreate} className="bg-[#800000] text-[#d4af37] px-8 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center space-x-3 rounded-lg">
          <Zap className="w-4 h-4 animate-pulse" />
          <span>Ghi nhận quân nhân mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.unitData.map((unit, idx) => (
          <div key={idx} className={`relative bg-white border-2 p-6 rounded-3xl ${unit.trungbinh > 0 ? 'border-red-500 shadow-lg' : 'border-slate-100 shadow-sm'}`}>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-black text-slate-900 uppercase">{unit.name}</h3>
                <span className={`text-xl font-black ${unit.healthScore > 80 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(unit.healthScore)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden border border-slate-50 p-0.5">
                  <div className="h-full bg-green-600" style={{ width: `${unit.totPct}%` }}></div>
                  <div className="h-full bg-[#d4af37]" style={{ width: `${unit.khaPct}%` }}></div>
                  <div className="h-full bg-red-600" style={{ width: `${unit.tbPct}%` }}></div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="text-center p-2 bg-green-50 rounded-xl">
                  <span className="block text-[7px] font-black text-green-800 uppercase">Tốt</span>
                  <span className="text-sm font-black text-green-700">{unit.tot}</span>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded-xl">
                  <span className="block text-[7px] font-black text-amber-800 uppercase">Khá</span>
                  <span className="text-sm font-black text-[#b8860b]">{unit.kha}</span>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-xl">
                  <span className="block text-[7px] font-black text-red-800 uppercase">TB</span>
                  <span className="text-sm font-black text-red-700">{unit.trungbinh}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-[#800000] shadow-xl overflow-hidden rounded-2xl">
        <div className="px-8 py-5 bg-[#800000] text-[#d4af37] flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Crosshair className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cơ sở dữ liệu biên chế & tư tưởng (KĐ/TĐ/C)</span>
          </div>
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#d4af37]/60" />
             <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm tên, quê quán, đơn vị..." className="w-full pl-9 pr-4 py-2 bg-black/20 border border-[#d4af37]/30 text-[10px] text-white rounded-lg outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Quân nhân / Cấp bậc</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Chức vụ & Quê quán</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Biên chế quản lý</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Phân loại</th>
                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-[#800000] rounded-xl font-black text-xs uppercase shadow-inner">
                        {log.rank?.charAt(0) || 'B'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase">{log.soldierName}</p>
                        <p className="text-[9px] text-[#800000] font-black uppercase tracking-widest">{log.rank}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">{log.position}</p>
                      <div className="flex items-center text-[9px] text-slate-400 font-medium">
                        <MapPin className="w-2.5 h-2.5 mr-1 text-[#800000]" />
                        <span className="italic">{log.hometown || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-1 text-[9px] font-black text-slate-400 uppercase">
                       <span className="bg-slate-100 px-2 py-0.5 rounded">{log.squad}</span>
                       <span className="text-slate-300">/</span>
                       <span className="bg-slate-100 px-2 py-0.5 rounded">{log.platoon}</span>
                       <span className="text-slate-300">/</span>
                       <span className="bg-[#800000] text-white px-2 py-0.5 rounded">{log.soldierUnit}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border ${
                       log.status.includes('trung bình') ? 'bg-red-600 text-white' : log.status.includes('khá') ? 'bg-[#d4af37] text-white' : 'bg-green-600 text-white'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(log)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteIdeologyLog(log.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-start justify-center p-6 pt-12 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl shadow-2xl border-t-[12px] border-[#800000] rounded-3xl overflow-hidden mb-12">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-[#800000] uppercase text-lg tracking-tight flex items-center">
                {editingLog ? <Pencil className="w-5 h-5 mr-3" /> : <Star className="w-5 h-5 mr-3" />}
                Quản lý Hồ sơ Quân nhân
              </h3>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full hover:text-red-500 transition-colors"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Họ và tên quân nhân</label>
                  <input required value={newLog.soldierName} onChange={e => setNewLog({...newLog, soldierName: e.target.value.toUpperCase()})} placeholder="VD: NGUYỄN VĂN A" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Quê quán</label>
                  <input required value={newLog.hometown} onChange={e => setNewLog({...newLog, hometown: e.target.value})} placeholder="VD: Đô Lương, Nghệ An" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-bold rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Cấp bậc</label>
                  <select value={newLog.rank} onChange={e => setNewLog({...newLog, rank: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm font-black rounded-xl">
                    {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Chức vụ</label>
                  <select value={newLog.position} onChange={e => setNewLog({...newLog, position: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm font-black rounded-xl">
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Khẩu đội (KĐ)</label>
                  <select value={newLog.squad} onChange={e => setNewLog({...newLog, squad: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg">
                    {SQUADS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Trung đội (TĐ)</label>
                  <select value={newLog.platoon} onChange={e => setNewLog({...newLog, platoon: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg">
                    {PLATOONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Đại đội quản lý (C)</label>
                  <select value={newLog.soldierUnit} onChange={e => setNewLog({...newLog, soldierUnit: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg">
                    {MILITARY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Đánh giá tư tưởng</label>
                <div className="flex space-x-2">
                  {['tốt', 'khá', 'trung bình'].map(s => (
                    <button key={s} type="button" onClick={() => setNewLog({...newLog, status: s as any})} className={`flex-1 py-3 text-[9px] font-black uppercase border-2 rounded-xl transition-all ${newLog.status === s ? 'bg-[#800000] text-[#d4af37] border-black' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Diễn biến & Biểu hiện cụ thể</label>
                <textarea required value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})} placeholder="Ghi nhận thái độ, kết quả thực hiện nhiệm vụ, các biểu hiện nảy sinh..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm h-24 rounded-xl outline-none focus:border-[#800000]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Hoàn cảnh gia đình / Hậu phương</label>
                  <input value={newLog.familyContext} onChange={e => setNewLog({...newLog, familyContext: e.target.value})} placeholder="VD: Bố mẹ ốm, vợ mới sinh..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs rounded-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Biện pháp giáo dục / Chỉ đạo</label>
                  <input value={newLog.officerNote} onChange={e => setNewLog({...newLog, officerNote: e.target.value})} placeholder="VD: Gặp gỡ động viên, cho nghỉ tranh thủ..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-xs rounded-lg italic" />
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-8 py-5 border-2 border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">Hủy</button>
                <button disabled={isSaving} className="flex-[2] bg-[#800000] text-[#d4af37] py-5 font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-4 hover:bg-black transition-all rounded-2xl shadow-xl">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>{isSaving ? 'ĐANG ĐỒNG BỘ...' : 'CẬP NHẬT HỆ THỐNG'}</span>
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
