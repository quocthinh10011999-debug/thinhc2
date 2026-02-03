
import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, Plus, Search, Filter, 
  AlertTriangle, CheckCircle2, Info, 
  ShieldAlert, History, User, Save, X, 
  Loader2, RefreshCw, BarChart3, PieChart,
  LayoutGrid, Activity, ChevronRight,
  ShieldCheck, Zap, Crosshair, Target,
  Flag, Award, AlertCircle, ListChecks,
  BookOpen, ShieldQuestion, Pencil, Trash2,
  ChevronDown
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { IdeologyLog } from '../types';

const AdminIdeology = () => {
  const { ideologyLogs, addIdeologyLog, updateIdeologyLog, deleteIdeologyLog, isLoading, lastSync } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLog, setEditingLog] = useState<IdeologyLog | null>(null);
  
  const [newLog, setNewLog] = useState({
    soldierName: '',
    soldierUnit: 'Đại đội 1' as string,
    status: 'tốt' as 'tốt' | 'khá' | 'trung bình',
    description: '',
    familyContext: '',
    officerNote: ''
  });

  const MILITARY_UNITS = ['Đại đội 1', 'Đại đội 2', 'Đại đội 3', 'Tiểu đoàn bộ'];

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
        count: uTotal, 
        tot: uTot,
        kha: uKha,
        trungbinh: uTrungBinh, 
        healthScore,
        totPct: uTotal > 0 ? (uTot / uTotal) * 100 : 0,
        khaPct: uTotal > 0 ? (uKha / uTotal) * 100 : 0,
        tbPct: uTotal > 0 ? (uTrungBinh / uTotal) * 100 : 0
      };
    });

    return { 
      total: ideologyLogs.length, 
      tot, kha, trungbinh, 
      totPct: (tot / total) * 100,
      khaPct: (kha / total) * 100,
      trungbinhPct: (trungbinh / total) * 100,
      unitData
    };
  }, [ideologyLogs]);

  const filteredLogs = ideologyLogs.filter(log => {
    const matchesSearch = log.soldierName.toLowerCase().includes(searchTerm.toLowerCase());
    const logStatus = (log.status === 'stable' ? 'tốt' : log.status === 'concern' ? 'khá' : log.status === 'urgent' ? 'trung bình' : log.status).toLowerCase();
    const matchesFilter = filterStatus === 'all' || logStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenCreate = () => {
    setEditingLog(null);
    setNewLog({ soldierName: '', soldierUnit: 'Đại đội 1', status: 'tốt', description: '', familyContext: '', officerNote: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (log: IdeologyLog) => {
    setEditingLog(log);
    const currentStatus = (log.status === 'stable' ? 'tốt' : log.status === 'concern' ? 'khá' : log.status === 'urgent' ? 'trung bình' : log.status) as any;
    setNewLog({
      soldierName: log.soldierName,
      soldierUnit: log.soldierUnit,
      status: currentStatus,
      description: log.description,
      familyContext: log.familyContext,
      officerNote: log.officerNote
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Cảnh báo: Xác nhận xóa hồ sơ tư tưởng này? Thao tác này không thể hoàn tác.')) {
      await deleteIdeologyLog(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingLog) {
        await updateIdeologyLog(editingLog.id, newLog);
      } else {
        await addIdeologyLog(newLog);
      }
      setShowForm(false);
      setEditingLog(null);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'trung bình' || s === 'urgent') return 'bg-red-600 text-white border-red-700';
    if (s === 'khá' || s === 'concern') return 'bg-[#d4af37] text-white border-amber-600';
    return 'bg-green-600 text-white border-green-700';
  };

  const criteria = [
    { label: 'Tốt', color: 'bg-green-600', text: 'Chấp hành nghiêm kỷ luật, an tâm công tác, hoàn thành tốt nhiệm vụ.' },
    { label: 'Khá', color: 'bg-[#d4af37]', text: 'Chấp hành kỷ luật khá, có vướng mắc nhẹ nhưng tự giác khắc phục.' },
    { label: 'Trung bình', color: 'bg-red-600', text: 'Có biểu hiện chán nản, vi phạm kỷ luật, nảy sinh tư tưởng tiêu cực.' }
  ];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-200 pb-8 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-[#800000] rounded shadow-[0_0_15px_rgba(128,0,0,0.3)]">
                <BrainCircuit className="w-6 h-6 text-[#d4af37]" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Bảng Chỉ huy Tư tưởng chiến lược</h1>
          </div>
          <div className="flex items-center space-x-6">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center">
                <Activity className="w-3 h-3 mr-2 text-green-500" />
                Dữ liệu đồng bộ: {lastSync?.toLocaleTimeString()}
             </p>
             <button onClick={() => setShowCriteria(true)} className="text-[10px] text-[#800000] font-black uppercase tracking-widest flex items-center hover:bg-red-50 px-3 py-1 rounded transition-colors">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Quy chuẩn phân loại
             </button>
          </div>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="group relative bg-[#800000] text-[#d4af37] px-8 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center space-x-3 overflow-hidden rounded-lg"
        >
          <Zap className="w-4 h-4 animate-pulse" />
          <span>Ghi nhận diễn biến mới</span>
        </button>
      </div>

      {/* PHẦN CHỈ SỐ ỔN ĐỊNH - HIỂN THỊ RÕ TỈ LỆ PHẦN TRĂM 3 LOẠI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.unitData.map((unit, idx) => (
          <div key={idx} className={`relative bg-white border-2 p-6 transition-all duration-500 rounded-3xl ${unit.trungbinh > 0 ? 'border-red-500 shadow-lg' : 'border-slate-100 shadow-sm'}`}>
            <div className="relative z-10 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">{unit.name}</h3>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Hệ số ổn định tổng thể</p>
                </div>
                <div className={`text-2xl font-black ${unit.healthScore > 80 ? 'text-green-600' : unit.healthScore > 50 ? 'text-[#d4af37]' : 'text-red-600'}`}>
                  {Math.round(unit.healthScore)}%
                </div>
              </div>

              {/* THANH TRẠNG THÁI ĐA SẮC: TỐT - KHÁ - TRUNG BÌNH */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner border border-slate-50">
                  <div className="h-full bg-green-600 transition-all duration-1000 flex items-center justify-center" style={{ width: `${unit.totPct}%` }}>
                    {unit.totPct > 20 && <span className="text-[7px] text-white font-black">{Math.round(unit.totPct)}%</span>}
                  </div>
                  <div className="h-full bg-[#d4af37] transition-all duration-1000 flex items-center justify-center" style={{ width: `${unit.khaPct}%` }}>
                    {unit.khaPct > 20 && <span className="text-[7px] text-white font-black">{Math.round(unit.khaPct)}%</span>}
                  </div>
                  <div className="h-full bg-red-600 transition-all duration-1000 flex items-center justify-center" style={{ width: `${unit.tbPct}%` }}>
                    {unit.tbPct > 20 && <span className="text-[7px] text-white font-black">{Math.round(unit.tbPct)}%</span>}
                  </div>
              </div>

              {/* BẢNG GHI RÕ SỐ LƯỢNG VÀ TỈ LỆ PHẦN TRĂM CỤ THỂ */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="text-center p-3 rounded-2xl bg-green-50 border border-green-100 shadow-sm">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-md shadow-green-200">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="block text-[8px] font-black text-green-800 uppercase tracking-tighter mb-1">Tốt</span>
                  <div className="flex flex-col">
                    <span className="text-base font-black text-green-700 leading-none">{unit.tot}</span>
                    <span className="text-[9px] font-bold text-green-600/70 mt-1">{Math.round(unit.totPct)}%</span>
                  </div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-amber-50 border border-amber-100 shadow-sm">
                  <div className="w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-md shadow-amber-200">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                  <span className="block text-[8px] font-black text-amber-800 uppercase tracking-tighter mb-1">Khá</span>
                  <div className="flex flex-col">
                    <span className="text-base font-black text-[#b8860b] leading-none">{unit.kha}</span>
                    <span className="text-[9px] font-bold text-[#b8860b]/70 mt-1">{Math.round(unit.khaPct)}%</span>
                  </div>
                </div>
                <div className="text-center p-3 rounded-2xl bg-red-50 border border-red-100 shadow-sm">
                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-md shadow-red-200">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="block text-[8px] font-black text-red-800 uppercase tracking-tighter mb-1">T.Bình</span>
                  <div className="flex flex-col">
                    <span className="text-base font-black text-red-700 leading-none">{unit.trungbinh}</span>
                    <span className="text-[9px] font-bold text-red-600/70 mt-1">{Math.round(unit.tbPct)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm quân nhân..." 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl focus:border-[#800000] outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
               {['all', 'tốt', 'khá', 'trung bình'].map(status => (
                 <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-full whitespace-nowrap transition-all border ${filterStatus === status ? 'bg-[#800000] text-[#d4af37] border-[#800000] shadow-md' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-[#800000]'}`}
                 >
                   {status === 'all' ? 'Toàn bộ' : status}
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-white border-2 border-[#800000] shadow-xl overflow-hidden rounded-2xl">
            <div className="px-8 py-5 bg-[#800000] border-b border-[#d4af37] flex justify-between items-center text-[#d4af37]">
              <div className="flex items-center space-x-4">
                <Crosshair className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cơ sở dữ liệu tư tưởng đơn vị</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Quân nhân</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Đơn vị</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Phân loại</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-[#800000] rounded-xl group-hover:bg-[#800000] group-hover:text-white transition-colors">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase">{log.soldierName}</p>
                            <p className="text-[9px] text-slate-400 font-bold italic line-clamp-1">{log.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[10px] font-black text-[#800000] bg-red-50 px-3 py-1 rounded-lg border border-red-100 uppercase">
                          {log.soldierUnit}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center space-x-2 inline-flex border ${getStatusStyle(log.status)} shadow-sm`}>
                          {log.status.includes('trung bình') || log.status === 'urgent' ? <AlertCircle className="w-3 h-3" /> : log.status.includes('khá') || log.status === 'concern' ? <Award className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          <span>{log.status.includes('trung bình') || log.status === 'urgent' ? 'Trung bình' : log.status.includes('khá') || log.status === 'concern' ? 'Khá' : 'Tốt'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => handleOpenEdit(log)}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 transition-all rounded-lg"
                            title="Sửa chi tiết"
                           >
                              <Pencil className="w-4 h-4" />
                           </button>
                           <button 
                            onClick={() => handleDelete(log.id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 transition-all rounded-lg"
                            title="Xóa hồ sơ"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Không tìm thấy dữ liệu quân nhân</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-slate-100 p-8 shadow-sm text-center rounded-3xl">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Tỷ lệ tư tưởng đơn vị</h3>
             <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#dc2626" strokeWidth="4" strokeDasharray={`${stats.trungbinhPct} ${100 - stats.trungbinhPct}`} />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#d4af37" strokeWidth="4" strokeDasharray={`${stats.khaPct} ${100 - stats.khaPct}`} strokeDashoffset={-stats.trungbinhPct} />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#16a34a" strokeWidth="4" strokeDasharray={`${stats.totPct} ${100 - stats.totPct}`} strokeDashoffset={-(stats.trungbinhPct + stats.khaPct)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Hồ sơ</span>
                </div>
             </div>
             <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase p-3 bg-green-50 text-green-700 rounded-xl border border-green-100">
                    <span className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div> Tốt</span>
                    <span className="font-black">{stats.tot} ({Math.round(stats.totPct)}%)</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                    <span className="flex items-center"><div className="w-2 h-2 bg-[#d4af37] rounded-full mr-2"></div> Khá</span>
                    <span className="font-black">{stats.kha} ({Math.round(stats.khaPct)}%)</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    <span className="flex items-center"><div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div> Trung bình</span>
                    <span className="font-black">{stats.trungbinh} ({Math.round(stats.trungbinhPct)}%)</span>
                </div>
             </div>
          </div>

          <div className="bg-[#800000] p-8 text-[#d4af37] shadow-xl space-y-6 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
             <div className="flex items-center space-x-3 relative z-10">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Đánh giá chung</h4>
             </div>
             <p className="text-[10px] leading-relaxed italic opacity-80 border-l-2 border-[#d4af37] pl-4 uppercase font-bold relative z-10">
               {stats.trungbinh > 0 
                ? `Cảnh báo: Có ${stats.trungbinh} trường hợp phân loại Trung bình. Đề nghị cán bộ chủ trì đại đội trực tiếp đối thoại nắm tâm tư.` 
                : "Tình hình tư tưởng ổn định. Đơn vị an tâm công tác, sẵn sàng nhận và hoàn thành mọi nhiệm vụ."}
             </p>
          </div>
        </div>
      </div>

      {/* MODAL: TIÊU CHUẨN PHÂN LOẠI - CĂN TRÊN CAO */}
      {showCriteria && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-start justify-center p-6 pt-12 md:pt-24 overflow-y-auto">
          <div className="bg-white w-full max-w-xl shadow-2xl border-t-[8px] border-[#800000] animate-subtle rounded-2xl overflow-hidden mb-12">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-[#800000] uppercase text-lg tracking-tight flex items-center">
                  <ListChecks className="w-5 h-5 mr-3" /> Quy chuẩn đánh giá tư tưởng
                </h3>
              <button onClick={() => setShowCriteria(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X /></button>
            </div>
            <div className="p-8 space-y-6">
                {criteria.map((c, idx) => (
                    <div key={idx} className="flex space-x-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${c.color} shadow-lg`}></div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase mb-1">{c.label}</h4>
                            <p className="text-[12px] font-medium text-slate-500 leading-relaxed italic">"{c.text}"</p>
                        </div>
                    </div>
                ))}
                <div className="p-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-start space-x-3">
                    <ShieldQuestion className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold uppercase leading-relaxed">Kết quả này được dùng làm cơ sở bình xét thi đua và đánh giá mức độ hoàn thành nhiệm vụ của quân nhân hàng tháng.</p>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL (THÊM/SỬA) - CĂN TRÊN CAO MÀN HÌNH */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-start justify-center p-6 pt-12 md:pt-20 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl shadow-2xl animate-subtle border-t-[12px] border-[#800000] rounded-3xl overflow-hidden mb-12">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-[#800000] uppercase text-lg tracking-tight flex items-center">
                {editingLog ? <Pencil className="w-5 h-5 mr-3 text-blue-600" /> : <Zap className="w-5 h-5 mr-3" />}
                {editingLog ? 'Chỉnh sửa hồ sơ quân nhân' : 'Ghi nhận diễn biến tư tưởng'}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Họ và tên quân nhân</label>
                  <input required value={newLog.soldierName} onChange={e => setNewLog({...newLog, soldierName: e.target.value.toUpperCase()})} placeholder="VD: NGUYỄN VĂN A" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black rounded-xl transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Đơn vị công tác</label>
                  <div className="relative">
                    <select value={newLog.soldierUnit} onChange={e => setNewLog({...newLog, soldierUnit: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm font-black rounded-xl appearance-none outline-none focus:border-[#800000] cursor-pointer">
                      {MILITARY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Phân loại diễn biến (Status)</label>
                <div className="grid grid-cols-3 gap-4">
                  {criteria.map(c => (
                    <button 
                      key={c.label} type="button" 
                      onClick={() => setNewLog({...newLog, status: c.label.toLowerCase() as any})}
                      className={`py-5 text-[10px] font-black uppercase border-2 transition-all rounded-2xl flex flex-col items-center justify-center space-y-2 ${newLog.status === c.label.toLowerCase() ? `${c.color} text-white border-black shadow-lg scale-105` : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-[#800000]'}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${newLog.status === c.label.toLowerCase() ? 'bg-white' : c.color}`}></div>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Biểu hiện / Diễn biến tâm lý</label>
                <textarea required value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})} placeholder="Mô tả cụ thể biểu hiện tư tưởng, thái độ trong học tập và công tác..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-medium h-28 rounded-xl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Thông tin hậu phương</label>
                  <input value={newLog.familyContext} onChange={e => setNewLog({...newLog, familyContext: e.target.value})} placeholder="Vấn đề gia đình, tình cảm (nếu có)..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm font-bold rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Chỉ thị của chỉ huy</label>
                  <input value={newLog.officerNote} onChange={e => setNewLog({...newLog, officerNote: e.target.value})} placeholder="Hướng xử lý tiếp theo..." className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 text-sm font-bold rounded-xl italic" />
                </div>
              </div>
              <div className="pt-6 flex space-x-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-8 py-5 border-2 border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">Hủy bỏ</button>
                <button disabled={isSaving} className="flex-[2] bg-[#800000] text-[#d4af37] py-5 font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-4 hover:bg-black transition-all rounded-2xl shadow-xl">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>{isSaving ? 'ĐANG XỬ LÝ...' : editingLog ? 'XÁC NHẬN CẬP NHẬT' : 'GHI VÀO HỆ THỐNG'}</span>
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
