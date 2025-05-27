import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoData } from '../types';

interface SavedVideosContextType {
  savedVideos: VideoData[];
  addToSavedVideos: (video: VideoData) => void;
  removeFromSavedVideos: (videoId: number) => void;
  isVideoSaved: (videoId: number) => boolean;
}

const SavedVideosContext = createContext<SavedVideosContextType | undefined>(undefined);

export const useSavedVideos = () => {
  const context = useContext(SavedVideosContext);
  if (context === undefined) {
    throw new Error('useSavedVideos must be used within a SavedVideosProvider');
  }
  return context;
};

export const SavedVideosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedVideos, setSavedVideos] = useState<VideoData[]>(() => {
    const saved = localStorage.getItem('savedVideos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
  }, [savedVideos]);

  const addToSavedVideos = (video: VideoData) => {
    setSavedVideos(prev => {
      if (!prev.some(v => v.content_id === video.content_id)) {
        return [...prev, video];
      }
      return prev;
    });
  };

  const removeFromSavedVideos = (videoId: number) => {
    setSavedVideos(prev => prev.filter(video => video.content_id !== videoId));
  };

  const isVideoSaved = (videoId: number) => {
    return savedVideos.some(video => video.content_id === videoId);
  };

  return (
    <SavedVideosContext.Provider value={{
      savedVideos,
      addToSavedVideos,
      removeFromSavedVideos,
      isVideoSaved
    }}>
      {children}
    </SavedVideosContext.Provider>
  );
};