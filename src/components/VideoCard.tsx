import React from 'react';
import { VideoData } from '../types';
import { Clock, Calendar, Play } from 'lucide-react';
import { useSavedVideos } from '../contexts/SavedVideosContext';

interface VideoCardProps {
  video: VideoData;
  onClick: () => void;
  isEditing?: boolean;
  isSelected?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, isEditing = false, isSelected = false }) => {
  const coverImage = video.assets.cover[0]?.url || 'https://via.placeholder.com/300x400';
  const { savedVideos } = useSavedVideos();
  
  // Check if any episode from this series is saved
  const isSeriesRecommended = savedVideos.some(
    savedVideo => savedVideo.collection_title === video.collection_title
  );
  
  // Format duration from seconds to minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform cursor-pointer ${
        isEditing 
          ? isSelected 
            ? 'ring-2 ring-pink-500' 
            : 'hover:ring-2 hover:ring-gray-400'
          : 'hover:shadow-pink-500/30 hover:-translate-y-1'
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={coverImage} 
          alt={video.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {!isEditing && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-pink-500 rounded-full p-3 transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
              <Play className="w-6 h-6 text-white\" fill="white" />
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {video.collection_title.includes("Season") 
            ? isSeriesRecommended 
              ? "RECOMMENDED" 
              : "SERIES" 
            : "MOVIE"}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <div className="flex items-center text-sm text-gray-300 space-x-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{video.product_year}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm text-white line-clamp-1">{video.title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;