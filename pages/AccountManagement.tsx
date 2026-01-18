
import React, { useState } from 'react';
import { Users, UserPlus, Shield, Trash2, Key, ShieldCheck, Search, Filter, MoreVertical, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AccountManagement = () => {
  const { user, accounts, addAccount } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAcc, setNewAcc] = useState({ username: '', fullName: '', role: 'staff' as const });

  // Bảo vệ route: Chỉ admin mới được vào
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({ ...newAcc });
    setNewAcc({ username: '', fullName: '', role: 'staff' });
    setShowAddForm(false);
  };

  return (
    <div className="bg-[#fffcf5] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-[#800000] pb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-[#d4af37]">
                <ShieldCheck className="w-5 h-5 text-[#800000]" />
                <span className="text-[10px] font-bold text-[#800000] uppercase tracking-[0.4em]">Security Clearance: Level 5</span>
            </div>
            <h1 className="text-3xl font-black text-[#800000] uppercase tracking-tighter">Quản trị hệ thống</h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Danh sách cán bộ vận hành cổng thông tin điện tử</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#800000] text-[#d4af37] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center shadow-lg"
          >
            <UserPlus className="w-4 h-4 mr-3" /> Cấp quyền tài khoản
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-l-8 border-[#800000] shadow-sm flex items-center space-x-6">
                <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-[#800000]">
                    <Users className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng nhân sự</p>
                    <p className="text-xl font-black text-[#800000]">{accounts.length}</p>
                </div>
            </div>
            <div className="bg-white p-6 border-l-8 border-[#d4af37] shadow-sm flex items-center space-x-6">
                <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-[#d4af37]">
                    <Shield className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quản trị viên</p>
                    <p className="text-xl font-black text-[#800000]">{accounts.filter(a => a.role === 'admin').length}</p>
                </div>
            </div>
            <div className="bg-white p-6 border-l-8 border-green-600 shadow-sm flex items-center space-x-6">
                <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái hệ thống</p>
                    <p className="text-xl font-black text-slate-900 uppercase">Ổn định</p>
                </div>
            </div>
        </div>

        {showAddForm && (
          <div className="bg-white p-8 border-4 border-[#d4af37] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-[#800000] uppercase text-sm tracking-tight flex items-center">
                    <Key className="w-4 h-4 mr-3 text-[#d4af37]" /> Khởi tạo mã định danh mới
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-[#800000] hover:text-black">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tên đăng nhập (ID)</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#800000] outline-none text-sm font-bold"
                  value={newAcc.username}
                  onChange={(e) => setNewAcc({...newAcc, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Họ tên đầy đủ</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#800000] outline-none text-sm font-bold"
                  value={newAcc.fullName}
                  onChange={(e) => setNewAcc({...newAcc, fullName: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-[#800000] text-[#d4af37] py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all">Xác nhận cấp phát</button>
              </div>
            </form>
            <p className="mt-4 text-[9px] text-[#800000] font-bold uppercase tracking-widest italic">* Mật khẩu truy cập mặc định: "123"</p>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white border-2 border-[#800000] shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#800000] border-b border-[#d4af37] flex justify-between items-center text-[#d4af37]">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60" />
                <input type="text" placeholder="Lọc cán bộ..." className="pl-10 pr-4 py-1.5 bg-black/20 border-none text-[11px] font-bold uppercase tracking-widest outline-none w-48 text-white placeholder:text-[#d4af37]/40" />
             </div>
             <div className="flex items-center space-x-4">
                <Filter className="w-4 h-4 text-[#d4af37] cursor-pointer" />
                <MoreVertical className="w-4 h-4 text-[#d4af37] cursor-pointer" />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#d4af37]/20">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhân sự</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mức truy cập</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {accounts.map((acc, idx) => (
                  <tr key={idx} className="hover:bg-[#fffcf5] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 flex items-center justify-center font-black text-[10px] ${acc.role === 'admin' ? 'bg-[#800000] text-[#d4af37]' : 'bg-slate-100 text-[#800000]'}`}>
                          {acc.fullName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{acc.fullName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-mono text-[11px]">{acc.username}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase ${
                        acc.role === 'admin' ? 'text-[#800000] bg-red-50 border border-[#800000]/20' : 'text-blue-600 bg-blue-50'
                      }`}>
                        {acc.role === 'admin' ? 'Administrator' : 'Staff Member'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-[#800000] hover:text-[#d4af37] text-slate-400 transition-all"><Key className="w-3.5 h-3.5" /></button>
                            {acc.username !== 'admin' && (
                                <button className="p-2 hover:bg-[#800000] hover:text-white text-slate-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                            )}
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Hint */}
        <div className="text-center pt-10">
            <p className="text-[9px] font-bold text-[#800000] uppercase tracking-[0.3em]">Mọi thao tác quản trị đều được lưu vết an ninh kỹ thuật số</p>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
