import React, { useEffect, useRef, useState } from 'react';
import { fetchVideos } from '../api';
import { VideoData } from '../types';
import { Bookmark, Share2, List, Settings, ChevronLeft } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useSavedVideos } from '../contexts/SavedVideosContext';
import ShareModal from '../components/ShareModal';
import EpisodesModal from '../components/EpisodesModal';
import { trackContentConsumption } from '../services/snowplow';
import { useNavigate } from 'react-router-dom';
import { useGesture } from '@use-gesture/react';

declare global {
  interface Window {
    jwplayer: (id: string) => any;
  }
}

const VideoFeedItem = ({ 
  video, 
  isActive,
  onShare,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  allVideos,
  nextVideo,
  currentIndex,
  apiRequestUrl
}: { 
  video: VideoData;
  isActive: boolean;
  onShare: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  allVideos: VideoData[];
  nextVideo: VideoData | null;
  currentIndex: number;
  apiRequestUrl: string | null;
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [playerInstance, setPlayerInstance] = useState<any>(null);
  const { addToSavedVideos, removeFromSavedVideos, isVideoSaved } = useSavedVideos();
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('720p');
  const [showEpisodesModal, setShowEpisodesModal] = useState(false);
  const navigate = useNavigate();
  
  // Filter videos to only include those from the same collection as the current video
  const sameCollectionVideos = allVideos
    .filter(v => v.collection_title === video.collection_title)
    .sort((a, b) => a.display_order - b.display_order); // Sort by display_order
  
  // Handle swipe gestures
  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], direction: [dx], distance }) => {
        if (distance < 50) return; // Minimum swipe distance

        // Horizontal swipe
        if (Math.abs(dx) > 0) {
          if (dx < 0 && hasNext) {
            onNext();
          } else if (dx > 0 && hasPrev) {
            onPrev();
          }
        }
      }
    },
    {
      drag: {
        threshold: 50,
        filterTaps: true,
        rubberband: true
      }
    }
  );
  
  useEffect(() => {
    if (!videoRef.current || typeof window.jwplayer !== 'function') return;
    
    // Initialize player
    const player = window.jwplayer(videoRef.current.id);
    
    player.setup({
      file: video.deliveries.mainDelivery.url_without_token,
      image: video.assets.cover[0]?.url,
      width: '100%',
      height: '100%',
      aspectratio: '16:9',
      mute: !isActive,
      autostart: isActive,
      repeat: false, // Changed from true to false to enable complete event
      controls: true,
      stretching: 'fill',
      playbackRateControls: false,
      primary: 'html5',
      preload: 'auto',
      cast: {
        appid: 'YOUR_CHROMECAST_APP_ID', // Replace with your Chromecast app ID
        customAppId: 'YOUR_CHROMECAST_APP_ID' // Replace with your Chromecast app ID
      }
    });
    
    player.on('ready', () => {
      if (isActive) {
        player.play();
      }
    });

    player.on('play', () => {
      if (isActive) {
        trackContentConsumption();
      }
    });
    
    // Add event listener for video completion
    player.on('complete', () => {
      console.log('Video completed, moving to next video');
      if (isActive && hasNext && nextVideo) {
        // Add a small delay to make the transition smoother
        setTimeout(() => {
          onNext();
        }, 500);
      }
    });
    
    setPlayerInstance(player);
    
    return () => {
      player.remove();
    };
  }, [video, videoRef, isActive, hasNext, nextVideo, onNext]);
  
  // Handle active state changes
  useEffect(() => {
    if (!playerInstance) return;
    
    if (isActive) {
      playerInstance.play();
      playerInstance.setMute(false);
    } else {
      playerInstance.pause();
      playerInstance.setMute(true);
    }
  }, [isActive, playerInstance]);

  const handleSave = () => {
    if (isVideoSaved(video.content_id)) {
      removeFromSavedVideos(video.content_id);
    } else {
      addToSavedVideos(video);
    }
  };

  const qualities = ['1080p', '720p', '480p', '360p'];
  
  return (
    <div 
      className="relative h-full w-full bg-black flex items-center justify-center"
      {...bind()}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-white mr-4"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white font-medium text-lg line-clamp-1">
              {video.title}
            </h1>
          </div>
        </div>
      </div>

      <div 
        id={`player-${video.content_id}`} 
        ref={videoRef}
        className="absolute inset-0"
      />
      
      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
        <button 
          className="text-white flex flex-col items-center"
          onClick={handleSave}
        >
          <div className={`p-2 rounded-full transition-colors ${
            isVideoSaved(video.content_id) 
              ? 'bg-pink-600' 
              : 'bg-black/30'
          }`}>
            <Bookmark className={`w-7 h-7 ${
              isVideoSaved(video.content_id) 
                ? 'fill-white' 
                : ''
            }`} />
          </div>
          <span className="text-xs mt-1">Save</span>
        </button>

        <button 
          className="text-white flex flex-col items-center"
          onClick={onShare}
        >
          <div className="bg-black/30 p-2 rounded-full">
            <Share2 className="w-7 h-7" />
          </div>
          <span className="text-xs mt-1">Share</span>
        </button>

        <button 
          className="text-white flex flex-col items-center"
          onClick={() => setShowEpisodesModal(true)}
        >
          <div className="bg-black/30 p-2 rounded-full">
            <List className="w-7 h-7" />
          </div>
          <span className="text-xs mt-1">Episodes</span>
        </button>

        <div className="relative">
          <button 
            className="text-white flex flex-col items-center"
            onClick={() => setShowQualityMenu(!showQualityMenu)}
          >
            <div className="bg-black/30 p-2 rounded-full">
              <Settings className="w-7 h-7" />
            </div>
            <span className="text-xs mt-1">{currentQuality}</span>
          </button>

          {showQualityMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden">
              {qualities.map(quality => (
                <button
                  key={quality}
                  className={`block w-full px-6 py-2 text-sm text-left hover:bg-white/10 ${
                    quality === currentQuality ? 'text-pink-500' : 'text-white'
                  }`}
                  onClick={() => {
                    setCurrentQuality(quality);
                    setShowQualityMenu(false);
                  }}
                >
                  {quality}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Episodes Modal */}
      {showEpisodesModal && (
        <EpisodesModal
          episodes={sameCollectionVideos}
          currentEpisode={video}
          onSelectEpisode={(episode) => {
            setShowEpisodesModal(false);
            // Find the index of the selected episode in the main videos array
            const selectedIndex = allVideos.findIndex(v => v.content_id === episode.content_id);
            if (selectedIndex !== -1) {
              // Directly navigate to the selected episode index in the main feed
              if (selectedIndex !== currentIndex) {
                const selectedElement = document.querySelector(`[data-index="${selectedIndex}"]`);
                if (selectedElement) {
                  selectedElement.scrollIntoView({ behavior: 'smooth' });
                  // Wait for the scroll to complete before updating the index
                  setTimeout(() => {
                    window.dispatchEvent(new Event('scroll')); // Trigger scroll event to update index
                  }, 300);
                }
              }
            }
          }}
          onClose={() => setShowEpisodesModal(false)}
        />
      )}
    </div>
  );
};

const FeedPage = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [apiRequestUrl, setApiRequestUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('FeedPage - Fetching videos from Galaxy API');
        
        // Create and capture the API URL before making the request
        const GALAXY_API_BASE_URL = 'https://galaxy-api.galaxydve.com';
        const GALAXY_API_KEY = 'api_key_iatest';
        const GALAXY_API_SECRET = 'GaLxAiDviTS12*';
        const GALAXY_CAMPAIGN_ID = '5027';
        const GALAXY_SERVICE_ID = '39';
        const GALAXY_COUNTRY_CODE = 'gb';
        const GALAXY_LANGUAGE_CODE = 'en';
        
        const params = new URLSearchParams({
          api_key: GALAXY_API_KEY,
          api_secret_key: GALAXY_API_SECRET,
          country_code: GALAXY_COUNTRY_CODE,
          language_code: GALAXY_LANGUAGE_CODE,
          campaign_id: GALAXY_CAMPAIGN_ID,
          service_id: GALAXY_SERVICE_ID,
          content_type: 'movie,tv_movie,series,series_episode',
          preview: 'true',
          asset: 'true',
          delivery: 'true',
          without_token: 'true',
          itemsPerPage: '100',
          page: '1'
        });
        
        const fullApiUrl = `${GALAXY_API_BASE_URL}/publishing-content-list?${params.toString()}`;
        setApiRequestUrl(fullApiUrl);
        
        const response = await fetchVideos();
        console.log('FeedPage - Videos received:', response.data.data.length);
        
        if (response.data.data.length > 0) {
          setVideos(response.data.data);
        } else {
          setError('No videos available to display');
        }
      } catch (err) {
        setError('Failed to load videos. Please try again later.');
        console.error('FeedPage - Error loading videos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadVideos();
  }, []);
  
  // Handle scroll to update current visible video
  useEffect(() => {
    if (videos.length === 0) return;
    
    const handleScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          setCurrentVideoIndex(index);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.7, // 70% of the item must be visible
    });
    
    // Observe all video container elements
    document.querySelectorAll('.video-container').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [videos.length]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  if (error || videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center p-6 bg-red-900 bg-opacity-20 rounded-lg">
          <p className="text-red-400">{error || 'No videos available'}</p>
        </div>
      </div>
    );
  }

  const handleShare = (video: VideoData) => {
    setSelectedVideo(video);
    setShowShareModal(true);
  };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      
      // Scroll to the next video with animation
      const nextVideoElement = document.querySelector(`[data-index="${currentVideoIndex + 1}"]`);
      if (nextVideoElement) {
        nextVideoElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      
      // Scroll to the previous video with animation
      const prevVideoElement = document.querySelector(`[data-index="${currentVideoIndex - 1}"]`);
      if (prevVideoElement) {
        prevVideoElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Determine the next video
  const getNextVideo = (currentIndex: number): VideoData | null => {
    if (currentIndex < videos.length - 1) {
      return videos[currentIndex + 1];
    }
    return null;
  };
  
  return (
    <div className="h-screen bg-black overflow-hidden">
      <div 
        className="h-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
      >
        {videos.map((video, index) => (
          <div 
            key={video.content_id}
            className="h-screen w-full snap-start video-container"
            data-index={index}
          >
            <VideoFeedItem 
              video={video} 
              isActive={index === currentVideoIndex}
              onShare={() => handleShare(video)}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={index < videos.length - 1}
              hasPrev={index > 0}
              allVideos={videos}
              nextVideo={getNextVideo(index)}
              currentIndex={currentVideoIndex}
              apiRequestUrl={apiRequestUrl}
            />
          </div>
        ))}
      </div>
      
      {showShareModal && selectedVideo && (
        <ShareModal 
          video={selectedVideo} 
          onClose={() => {
            setShowShareModal(false);
            setSelectedVideo(null);
          }} 
        />
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default FeedPage;