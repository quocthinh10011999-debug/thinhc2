import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { MusicTrack } from '../types';

interface MusicContextType {
  tracks: MusicTrack[];
  activeTrack: MusicTrack | null;
  isPlaying: boolean;
  togglePlay: () => void;
  refreshMusic: () => Promise<void>;
  updateActiveTrack: (id: string) => Promise<void>;
  addTrack: (title: string, url: string) => Promise<void>;
  removeTrack: (id: string) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Fix: Complete MusicProvider implementation and ensure it returns a valid ReactNode
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const refreshMusic = useCallback(async () => {
    try {
      await api.ensureSchema();
      const musicList = await api.getMusic();
      setTracks(musicList);
      const active = musicList.find(t => t.isActive && t.url) || null;
      setActiveTrack(active);
    } catch (error) {
      console.error("Failed to load music list from DB:", error);
    }
  }, []);

  useEffect(() => {
    refreshMusic();
  }, [refreshMusic]);

  // Kiểm tra tính hợp lệ của URL âm thanh (Ưu tiên tệp vật lý)
  const isValidAudioUrl = (url: string) => {
    if (!url) return false;
    // Chấp nhận Data URL (file tải lên) hoặc Link MP3 trực tiếp
    if (url.startsWith('data:audio') || url.endsWith('.mp3') || url.endsWith('.ogg')) {
      return { valid: true };
    }
    
    // Chặn các định dạng không phải nhạc vật lý
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return { 
        valid: false, 
        message: "Hệ thống đã ngừng hỗ trợ Link YouTube. Vui lòng tải file MP3 từ máy tính lên để đảm bảo tính ổn định." 
      };
    }
    
    return { valid: true };
  };

  useEffect(() => {
    // 1. Dọn dẹp nếu không có track hoặc URL không hợp lệ
    const validation = isValidAudioUrl(activeTrack?.url || '');
    if (!activeTrack || !activeTrack.url || (typeof validation === 'object' && !validation.valid)) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        currentUrlRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    // 2. Khởi tạo đối tượng Audio nếu chưa có
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.preload = "auto";
      
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      
      // Fix: Access audioRef.current.error directly instead of using event.target to avoid TS error
      audioRef.current.onerror = () => {
        const error = audioRef.current?.error;
        let errorMessage = "Lỗi âm thanh không xác định";
        
        if (error) {
          switch (error.code) {
            case 1: errorMessage = "Tiến trình bị hủy bởi người dùng."; break;
            case 2: errorMessage = "Lỗi mạng - Không thể tải tệp âm thanh."; break;
            case 3: errorMessage = "Lỗi định dạng - Tệp này không phải âm thanh hợp lệ."; break;
            case 4: errorMessage = "Nguồn nhạc không hỗ trợ (Cần tải file MP3 trực tiếp)."; break;
          }
        }
        
        console.error("Audio Engine Critical Error:", errorMessage);
        setIsPlaying(false);
        currentUrlRef.current = null;
      };
    }

    // 3. Chỉ cập nhật nguồn nếu URL thực sự thay đổi và hợp lệ
    if (currentUrlRef.current !== activeTrack.url) {
      try {
        audioRef.current.src = activeTrack.url;
        currentUrlRef.current = activeTrack.url;
        // If it was playing, try to continue with the new source
        if (isPlaying) {
          audioRef.current.play().catch(e => console.warn("Auto-play blocked after source change:", e));
        }
      } catch (e) {
        console.error("Error updating audio source:", e);
      }
    }
  }, [activeTrack, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !activeTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Playback failed:", e);
        setIsPlaying(false);
      });
    }
  };

  const updateActiveTrack = async (id: string) => {
    try {
      await api.setActiveMusic(id);
      await refreshMusic();
    } catch (error) {
      console.error("Failed to update active track:", error);
    }
  };

  const addTrack = async (title: string, url: string) => {
    try {
      await api.addMusic(title, url);
      await refreshMusic();
    } catch (error) {
      console.error("Failed to add track:", error);
    }
  };

  const removeTrack = async (id: string) => {
    try {
      await api.deleteMusic(id);
      await refreshMusic();
    } catch (error) {
      console.error("Failed to remove track:", error);
    }
  };

  return (
    <MusicContext.Provider value={{ 
      tracks, 
      activeTrack, 
      isPlaying, 
      togglePlay, 
      refreshMusic, 
      updateActiveTrack, 
      addTrack, 
      removeTrack 
    }}>
      {children}
    </MusicContext.Provider>
  );
};

// Fix: Export useMusic hook for other components to use
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};