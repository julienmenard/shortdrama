import React, { useRef, useEffect } from 'react';
import { VideoData } from '../types';
import { X, Calendar, Clock, Cast } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VideoPlayerProps {
  video: VideoData;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!videoRef.current || typeof window.jwplayer !== 'function') return;

    const player = window.jwplayer(videoRef.current.id);
    playerRef.current = player;
    
    player.setup({
      file: video.deliveries.mainDelivery.url_without_token,
      image: video.assets.cover[0]?.url,
      width: '100%',
      height: '100%',
      aspectratio: '16:9',
      autostart: true,
      controls: true,
      primary: 'html5',
      hlshtml: true,
      preload: 'auto',
      stretching: 'uniform',
      playbackRateControls: false,
      cast: {
        appid: 'YOUR_CHROMECAST_APP_ID', // Replace with your Chromecast app ID
        customAppId: 'YOUR_CHROMECAST_APP_ID' // Replace with your Chromecast app ID
      },
      displaytitle: true,
      displaydescription: true
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, [video]);

  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCast = () => {
    if (playerRef.current) {
      playerRef.current.cast();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl animate-fade-in">
      <div className="relative">
        <div className="w-full max-w-4xl mx-auto">
          <div 
            id="jwplayer-container" 
            ref={videoRef}
            className="relative w-full"
            style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
          />
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button 
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
            onClick={handleCast}
            title={t('common.cast')}
          >
            <Cast className="w-5 h-5" />
          </button>
          <button 
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{video.title}</h2>
            <p className="text-purple-400 mt-1">{video.collection_title}</p>
          </div>
          <div className="flex space-x-4 text-gray-400">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{video.product_year}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-300 leading-relaxed">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;