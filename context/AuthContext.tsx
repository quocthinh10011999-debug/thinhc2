
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: 'admin' | 'staff';
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  accounts: User[];
  addAccount: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<User[]>([
    { username: 'admin', role: 'admin', fullName: 'Sĩ quan Trực ban' },
    { username: 'trucban1', role: 'staff', fullName: 'Trực ban Đại đội 1' }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('vms_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedAccounts = localStorage.getItem('vms_accounts');
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
  }, []);

  const login = (username: string, password: string) => {
    // Logic giả lập: admin/admin123 hoặc bất kỳ tài khoản nào với pass 123
    const foundAccount = accounts.find(a => a.username === username);
    const isValid = (username === 'admin' && password === 'admin123') || (foundAccount && password === '123');

    if (isValid) {
      const authUser = foundAccount || { username: 'admin', role: 'admin' as const, fullName: 'Sĩ quan Trực ban' };
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

  const addAccount = (newUser: User) => {
    const updated = [...accounts, newUser];
    setAccounts(updated);
    localStorage.setItem('vms_accounts', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, accounts, addAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
