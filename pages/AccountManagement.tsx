
import React, { useState } from 'react';
import { Users, UserPlus, Shield, Trash2, Key, ShieldCheck, Search, Filter, MoreVertical, ChevronRight, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AccountManagement = () => {
  const { user, accounts, addAccount, removeAccount, refreshAccounts } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAcc, setNewAcc] = useState({ username: '', fullName: '', role: 'staff' as const });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await addAccount({ ...newAcc });
      setNewAcc({ username: '', fullName: '', role: 'staff' });
      setShowAddForm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (username: string) => {
    if (username === 'admin') return alert('Không thể xóa tài khoản quản trị gốc');
    if (window.confirm(`Xác nhận xóa tài khoản "${username}" khỏi hệ thống PostgreSQL?`)) {
      setIsProcessing(true);
      try {
        await removeAccount(username);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-[#fffcf5] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-[#800000] pb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-[#d4af37]">
                <ShieldCheck className="w-5 h-5 text-[#800000]" />
                <span className="text-[10px] font-bold text-[#800000] uppercase tracking-[0.4em]">Quản lý Định danh SQL</span>
            </div>
            <h1 className="text-3xl font-black text-[#800000] uppercase tracking-tighter">Quản trị nhân sự</h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Đồng bộ trực tiếp với Neon PostgreSQL Cloud</p>
          </div>
          <button 
            disabled={isProcessing}
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#800000] text-[#d4af37] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center shadow-lg disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 mr-3 animate-spin" /> : <UserPlus className="w-4 h-4 mr-3" />}
            Cấp quyền tài khoản
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-8 border-4 border-[#d4af37] shadow-xl animate-subtle">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-[#800000] uppercase text-sm tracking-tight flex items-center">
                    <Key className="w-4 h-4 mr-3 text-[#d4af37]" /> Khởi tạo mã định danh SQL
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-[#800000] hover:text-black">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Username (Duy nhất)</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#800000] outline-none text-sm font-bold"
                  value={newAcc.username}
                  onChange={(e) => setNewAcc({...newAcc, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Họ tên quân nhân</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#800000] outline-none text-sm font-bold"
                  value={newAcc.fullName}
                  onChange={(e) => setNewAcc({...newAcc, fullName: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={isProcessing} className="flex-1 bg-[#800000] text-[#d4af37] py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50">
                    {isProcessing ? 'ĐANG GHI SQL...' : 'XÁC NHẬN CẤP PHÁT'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border-2 border-[#800000] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#800000] text-[#d4af37] border-b border-[#d4af37]/20">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Nhân sự</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Mã ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Quyền hạn</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((acc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 flex items-center justify-center font-black text-[10px] rounded ${acc.role === 'admin' ? 'bg-[#800000] text-[#d4af37]' : 'bg-slate-100 text-slate-400'}`}>
                          {acc.fullName.charAt(0)}
                        </div>
                        <span className="text-xs font-black text-slate-900 uppercase">{acc.fullName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-mono text-[11px] font-bold">{acc.username}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-[9px] font-black tracking-widest uppercase border ${
                        acc.role === 'admin' ? 'text-[#800000] border-[#800000]/20 bg-red-50' : 'text-blue-600 border-blue-100 bg-blue-50'
                      }`}>
                        {acc.role === 'admin' ? 'Commanding Officer' : 'Duty Officer'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                        {acc.username !== 'admin' && (
                            <button 
                                onClick={() => handleDelete(acc.username)}
                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
