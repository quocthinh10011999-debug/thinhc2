
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { IdeologyLog, QuizSet, QuizScore } from '../types';

interface DataContextType {
  registrations: any[];
  feedbacks: any[];
  ideologyLogs: IdeologyLog[];
  quizSets: QuizSet[];
  quizScores: QuizScore[];
  isLoading: boolean;
  lastSync: Date | null;
  refreshData: () => Promise<void>;
  updateRegStatus: (id: string, status: string) => Promise<void>;
  addIdeologyLog: (data: any) => Promise<void>;
  isApiConfigured: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [ideologyLogs, setIdeologyLogs] = useState<IdeologyLog[]>([]);
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.ensureSchema();
      
      const [regs, feeds, logs, sets, scores] = await Promise.all([
        api.getRegistrations(),
        api.getFeedbacks(),
        api.getIdeologyLogs(),
        api.getQuizSets(),
        api.getScores()
      ]);
      setRegistrations(regs);
      setFeedbacks(feeds);
      setIdeologyLogs(logs as any);
      setQuizSets(sets as any);
      setQuizScores(scores as any);
      setLastSync(new Date());
    } catch (error) {
      console.error("[POSTGRES] Sync error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRegStatus = async (id: string, status: string) => {
    try {
      await api.updateRegistration(id, { status });
      await refreshData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const addIdeologyLog = async (data: any) => {
    try {
      await api.createIdeologyLog(data);
      await refreshData();
    } catch (error) {
      console.error("Failed to add ideology log:", error);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60000); 
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <DataContext.Provider value={{ 
      registrations, 
      feedbacks, 
      ideologyLogs,
      quizSets,
      quizScores,
      isLoading, 
      lastSync, 
      refreshData, 
      updateRegStatus,
      addIdeologyLog,
      isApiConfigured: true
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
