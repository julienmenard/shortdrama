import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoData } from '../types';

interface WatchHistoryContextType {
  watchHistory: VideoData[];
  addToWatchHistory: (video: VideoData) => void;
  clearWatchHistory: () => void;
  removeFromWatchHistory: (videoId: number) => void;
  isVideoInHistory: (videoId: number) => boolean;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

export const useWatchHistory = () => {
  const context = useContext(WatchHistoryContext);
  if (context === undefined) {
    throw new Error('useWatchHistory must be used within a WatchHistoryProvider');
  }
  return context;
};

export const WatchHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchHistory, setWatchHistory] = useState<VideoData[]>(() => {
    const saved = localStorage.getItem('watchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  }, [watchHistory]);

  const addToWatchHistory = (video: VideoData) => {
    setWatchHistory(prev => {
      // Remove video if it already exists (to move it to the top)
      const filtered = prev.filter(v => v.content_id !== video.content_id);
      // Add video to the beginning of the array
      return [video, ...filtered];
    });
  };

  const clearWatchHistory = () => {
    setWatchHistory([]);
  };

  const removeFromWatchHistory = (videoId: number) => {
    setWatchHistory(prev => prev.filter(video => video.content_id !== videoId));
  };

  const isVideoInHistory = (videoId: number) => {
    return watchHistory.some(video => video.content_id === videoId);
  };

  return (
    <WatchHistoryContext.Provider value={{
      watchHistory,
      addToWatchHistory,
      clearWatchHistory,
      removeFromWatchHistory,
      isVideoInHistory
    }}>
      {children}
    </WatchHistoryContext.Provider>
  );
};