import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedVideos } from '../contexts/SavedVideosContext';
import { useWatchHistory } from '../contexts/WatchHistoryContext';
import { VideoData } from '../types';
import VideoCard from '../components/VideoCard';
import BottomNavigation from '../components/BottomNavigation';
import Logo from '../components/Logo';
import { Film, History, Pencil, X, Check, Trash2, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MyListPage = () => {
  const { savedVideos, removeFromSavedVideos, addToSavedVideos, isVideoSaved } = useSavedVideos();
  const { watchHistory, removeFromWatchHistory, clearWatchHistory, addToWatchHistory } = useWatchHistory();
  const [activeTab, setActiveTab] = useState<'mylist' | 'history'>('mylist');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleVideoSelect = (video: VideoData) => {
    if (isEditing) {
      setSelectedVideos(prev => 
        prev.includes(video.content_id)
          ? prev.filter(id => id !== video.content_id)
          : [...prev, video.content_id]
      );
    } else {
      navigate(`/video/${video.content_id}`, { state: { video } });
    }
  };

  const handleSelectAll = () => {
    const currentList = activeTab === 'mylist' ? savedVideos : watchHistory;
    if (selectedVideos.length === currentList.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(currentList.map(video => video.content_id));
    }
  };

  const handleRemoveSelected = () => {
    if (activeTab === 'mylist') {
      selectedVideos.forEach(videoId => {
        removeFromSavedVideos(videoId);
      });
    } else {
      selectedVideos.forEach(videoId => {
        removeFromWatchHistory(videoId);
      });
    }
    setSelectedVideos([]);
    setIsEditing(false);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire watch history?')) {
      clearWatchHistory();
      setIsEditing(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSelectedVideos([]);
  };

  const handleSaveVideo = (video: VideoData) => {
    if (isVideoSaved(video.content_id)) {
      removeFromSavedVideos(video.content_id);
    } else {
      addToSavedVideos(video);
    }
  };

  const renderMyListContent = () => {
    if (savedVideos.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No saved videos yet</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {savedVideos.map((video) => (
          <div key={video.content_id} className="relative">
            <VideoCard
              video={video}
              onClick={() => handleVideoSelect(video)}
              isEditing={isEditing}
              isSelected={selectedVideos.includes(video.content_id)}
            />
            {isEditing && (
              <div 
                className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedVideos.includes(video.content_id)
                    ? 'bg-pink-500 border-pink-500'
                    : 'border-white bg-black/50'
                }`}
              >
                {selectedVideos.includes(video.content_id) && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderHistoryContent = () => {
    if (watchHistory.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No watch history yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {watchHistory.map((video) => {
          const isSaved = isVideoSaved(video.content_id);
          
          return (
            <div 
              key={video.content_id} 
              className="flex items-center gap-3"
            >
              {/* Selectable checkbox when editing */}
              {isEditing && (
                <div 
                  onClick={() => handleVideoSelect(video)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedVideos.includes(video.content_id)
                      ? 'bg-pink-500 border-pink-500'
                      : 'border-white bg-black/50'
                  }`}
                >
                  {selectedVideos.includes(video.content_id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              
              {/* Thumbnail image */}
              <div 
                className="flex-shrink-0 w-20 h-24 rounded-md overflow-hidden cursor-pointer"
                onClick={() => !isEditing && handleVideoSelect(video)}
              >
                <img 
                  src={video.assets.cover[0]?.url} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Video details */}
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => !isEditing && handleVideoSelect(video)}
              >
                <h3 className="font-medium text-white line-clamp-1">
                  {video.collection_title.split(' - ')[0]}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1 mb-1">
                  {video.description.substring(0, 60)}...
                </p>
                <p className="text-xs text-pink-500">
                  EP.{video.display_order}
                </p>
              </div>
              
              {/* Bookmark button */}
              {!isEditing && (
                <button 
                  className="flex-shrink-0 p-2"
                  onClick={() => handleSaveVideo(video)}
                >
                  <Bookmark 
                    className={`w-5 h-5 ${
                      isSaved ? 'text-pink-500 fill-pink-500' : 'text-white'
                    }`} 
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="sticky top-0 z-10 bg-black bg-opacity-95">
        <div className="px-4 pt-4">
          <div className="flex justify-center mb-4">
            <Logo size="medium" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              <button
                className={`pb-2 relative ${
                  activeTab === 'mylist' ? 'text-white font-medium' : 'text-gray-500'
                }`}
                onClick={() => {
                  setActiveTab('mylist');
                  setIsEditing(false);
                  setSelectedVideos([]);
                }}
              >
                My List
                {activeTab === 'mylist' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />
                )}
              </button>
              <button
                className={`pb-2 relative ${
                  activeTab === 'history' ? 'text-white font-medium' : 'text-gray-500'
                }`}
                onClick={() => {
                  setActiveTab('history');
                  setIsEditing(false);
                  setSelectedVideos([]);
                }}
              >
                History
                {activeTab === 'history' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />
                )}
              </button>
            </div>
            {/* Only show edit button for My List, not for History */}
            {!isEditing && activeTab === 'mylist' && savedVideos.length > 0 && (
              <button
                onClick={toggleEdit}
                className="p-2 text-white hover:text-pink-500 transition-colors"
              >
                <Pencil className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="h-px bg-gray-800 mt-2" />
        </div>
      </div>

      <div className="px-4 pt-4">
        {activeTab === 'mylist' ? renderMyListContent() : renderHistoryContent()}
      </div>

      {isEditing && (activeTab === 'mylist' ? savedVideos.length > 0 : watchHistory.length > 0) && (
        <div className="fixed bottom-20 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="text-white text-sm"
            >
              Select All
            </button>
            <div className="flex space-x-2">
              {activeTab === 'history' && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center space-x-1 bg-gray-700 text-white px-4 py-2 rounded-full text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              )}
              {selectedVideos.length > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-full text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Remove ({selectedVideos.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default MyListPage;