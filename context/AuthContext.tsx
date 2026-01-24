
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

interface User {
  username: string;
  role: 'admin' | 'staff';
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  accounts: User[];
  addAccount: (newUser: User) => Promise<void>;
  removeAccount: (username: string) => Promise<void>;
  refreshAccounts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<User[]>([]);

  const refreshAccounts = useCallback(async () => {
    try {
      const dbUsers = await api.getUsers();
      setAccounts(dbUsers as any);
    } catch (error) {
      console.error("Failed to fetch users from DB");
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('vms_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    refreshAccounts();
  }, [refreshAccounts]);

  const login = async (username: string, password: string) => {
    // Trong thực tế, cần kiểm tra password tại server. 
    // Ở đây demo so khớp dựa trên danh sách DB đã fetch.
    const found = accounts.find(a => a.username === username);
    
    // Logic giả lập pass: admin/admin123 hoặc user/123
    const isValid = (username === 'admin' && password === 'admin123') || (found && password === '123');

    if (isValid) {
      const authUser = found || { username: 'admin', role: 'admin' as const, fullName: 'Sĩ quan Trực ban' };
      setUser(authUser);
      localStorage.setItem('vms_user', JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vms_user');
  };

  const addAccount = async (newUser: User) => {
    await api.createUser(newUser);
    await refreshAccounts();
  };

  const removeAccount = async (username: string) => {
    await api.deleteUser(username);
    await refreshAccounts();
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, accounts, addAccount, removeAccount, refreshAccounts 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
