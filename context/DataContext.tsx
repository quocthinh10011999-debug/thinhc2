
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

interface DataContextType {
  registrations: any[];
  feedbacks: any[];
  isLoading: boolean;
  lastSync: Date | null;
  refreshData: () => Promise<void>;
  updateRegStatus: (id: string, status: string) => Promise<void>;
  isApiConfigured: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isApiConfigured, setIsApiConfigured] = useState(!!api.getConfig().baseUrl);

  const refreshData = useCallback(async () => {
    try {
      const [regs, feeds] = await Promise.all([
        api.getRegistrations(),
        api.getFeedbacks()
      ]);
      setRegistrations(Array.isArray(regs) ? regs : []);
      setFeedbacks(Array.isArray(feeds) ? feeds : []);
      setLastSync(new Date());
      setIsApiConfigured(!!api.getConfig().baseUrl);
    } catch (error) {
      console.error("[DATA] Failed to sync with remote server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRegStatus = async (id: string, status: string) => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;
    
    const updated = { ...reg, status };
    await api.updateRegistration(id, updated);
    await refreshData(); // Đồng bộ lại sau khi cập nhật
  };

  // Cơ chế Polling: Tự động đồng bộ mỗi 10 giây
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); 
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <DataContext.Provider value={{ 
      registrations, 
      feedbacks, 
      isLoading, 
      lastSync, 
      refreshData, 
      updateRegStatus,
      isApiConfigured
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
