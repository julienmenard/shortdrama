import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VideoData } from '../types';
import { ChevronLeft, Bookmark, Share2, List, Settings, X, ChevronDown } from 'lucide-react';
import { useGesture } from '@use-gesture/react';
import { fetchVideos } from '../api';
import { useSavedVideos } from '../contexts/SavedVideosContext';
import ShareModal from '../components/ShareModal';
import EpisodesModal from '../components/EpisodesModal';
import { trackContentConsumption } from '../services/snowplow';

declare global {
  interface Window {
    jwplayer: (id: string) => any;
  }
}

const VideoPlayerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = location.state as { video: VideoData };
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('720p');
  const [allVideos, setAllVideos] = useState<VideoData[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [series, setSeries] = useState<{ [key: string]: VideoData[] }>({});
  const [seriesOrder, setSeriesOrder] = useState<string[]>([]);
  const playerInstanceRef = useRef<any>(null);
  const { addToSavedVideos, removeFromSavedVideos, isVideoSaved } = useSavedVideos();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEpisodesModal, setShowEpisodesModal] = useState(false);
  const [currentSeriesEpisodes, setCurrentSeriesEpisodes] = useState<VideoData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextVideo, setNextVideo] = useState<VideoData | null>(null);

  // Load all videos and organize them by series
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetchVideos();
        const videos = response.data.data;
        setAllVideos(videos);

        // Group videos by collection title
        const seriesMap: { [key: string]: VideoData[] } = {};
        videos.forEach(v => {
          if (!seriesMap[v.collection_title]) {
            seriesMap[v.collection_title] = [];
          }
          seriesMap[v.collection_title].push(v);
        });

        // Sort episodes within each series by display_order
        Object.values(seriesMap).forEach(episodes => {
          episodes.sort((a, b) => a.display_order - b.display_order);
        });

        setSeries(seriesMap);
        setSeriesOrder(Object.keys(seriesMap));

        // Find current video's series and set current episodes
        const currentSeries = seriesMap[video.collection_title] || [];
        setCurrentSeriesEpisodes(currentSeries);
        
        // Set current indices
        const seriesIndex = Object.keys(seriesMap).findIndex(title => title === video.collection_title);
        const episodeIndex = currentSeries.findIndex(v => v.content_id === video.content_id);
        
        setCurrentSeriesIndex(seriesIndex);
        setCurrentVideoIndex(episodeIndex);

        // Determine next video
        if (episodeIndex < currentSeries.length - 1) {
          // Next episode in current series
          setNextVideo(currentSeries[episodeIndex + 1]);
        } else if (seriesIndex < Object.keys(seriesMap).length - 1) {
          // First episode of next series
          const nextSeriesTitle = Object.keys(seriesMap)[seriesIndex + 1];
          setNextVideo(seriesMap[nextSeriesTitle][0]);
        } else {
          // We're at the last episode of the last series, loop back to first video
          const firstSeriesTitle = Object.keys(seriesMap)[0];
          setNextVideo(seriesMap[firstSeriesTitle][0]);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setError('Failed to load episodes');
      }
    };

    loadVideos();
  }, [video.collection_title, video.content_id]);

  const initializePlayer = (videoToPlay: VideoData) => {
    if (!playerRef.current || typeof window.jwplayer !== 'function') return;

    try {
      // Clean up existing player if it exists
      if (playerInstanceRef.current) {
        playerInstanceRef.current.remove();
      }

      const player = window.jwplayer('jwplayer-container');
      playerInstanceRef.current = player;
      
      player.setup({
        file: videoToPlay.deliveries.mainDelivery.url_without_token,
        image: videoToPlay.assets.cover[0]?.url,
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
          appid: 'YOUR_CHROMECAST_APP_ID',
          customAppId: 'YOUR_CHROMECAST_APP_ID'
        }
      });

      player.on('ready', () => {
        setIsPlayerLoaded(true);
        setError(null);
        player.play();
      });

      player.on('play', () => {
        trackContentConsumption();
      });

      player.on('complete', () => {
        // Video has ended, transition to next video if available
        if (nextVideo) {
          handleAutoNext(nextVideo);
        }
      });

      player.on('error', (e: any) => {
        console.error('JWPlayer error:', e);
        setError('Failed to load video. Please try again.');
      });

    } catch (err) {
      console.error('Error initializing JWPlayer:', err);
      setError('Failed to initialize video player.');
    }
  };

  // Initialize player
  useEffect(() => {
    let checkInterval: number;

    const attemptInit = () => {
      if (typeof window.jwplayer === 'function') {
        initializePlayer(video);
        return;
      }
      
      let initAttempts = 0;
      const maxAttempts = 50;
      
      checkInterval = window.setInterval(() => {
        initAttempts++;
        
        if (typeof window.jwplayer === 'function') {
          clearInterval(checkInterval);
          initializePlayer(video);
        }
        
        if (initAttempts >= maxAttempts) {
          clearInterval(checkInterval);
          setError('Video player failed to load. Please refresh the page.');
        }
      }, 100);
    };

    attemptInit();

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.remove();
          playerInstanceRef.current = null;
        } catch (err) {
          console.error('Error during player cleanup:', err);
        }
      }
    };
  }, [video]);

  const handleAutoNext = (nextVid: VideoData) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Create swipe down animation with a container element
    const container = document.createElement('div');
    container.className = 'fixed inset-0 bg-black z-50 transition-transform duration-500 ease-in-out';
    container.style.transform = 'translateY(-100%)';
    
    // Create video preview inside the container
    const preview = document.createElement('div');
    preview.className = 'w-full h-full relative';
    
    // Add cover image
    const img = document.createElement('img');
    img.src = nextVid.assets.cover[0]?.url || '';
    img.className = 'w-full h-full object-cover';
    preview.appendChild(img);
    
    // Add overlay with video info
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6';
    
    const title = document.createElement('h3');
    title.className = 'text-white text-xl font-bold';
    title.textContent = nextVid.title;
    
    const seriesTitle = document.createElement('p');
    seriesTitle.className = 'text-pink-500 text-sm';
    seriesTitle.textContent = nextVid.collection_title;
    
    overlay.appendChild(title);
    overlay.appendChild(seriesTitle);
    preview.appendChild(overlay);
    
    // Add swipe indicator
    const indicator = document.createElement('div');
    indicator.className = 'absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white';
    
    const iconContainer = document.createElement('div');
    iconContainer.className = 'animate-bounce bg-black/50 rounded-full p-2 mb-2';
    iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    
    const text = document.createElement('span');
    text.className = 'text-sm bg-black/50 px-3 py-1 rounded-full';
    text.textContent = 'Next episode';
    
    indicator.appendChild(iconContainer);
    indicator.appendChild(text);
    preview.appendChild(indicator);
    
    container.appendChild(preview);
    document.body.appendChild(container);
    
    // Start animation after a small delay
    setTimeout(() => {
      container.style.transform = 'translateY(0)';
    }, 50);
    
    // Navigate to next video after animation completes
    setTimeout(() => {
      document.body.removeChild(container);
      navigate(`/video/${nextVid.content_id}`, { state: { video: nextVid } });
      setIsTransitioning(false);
    }, 550);
  };

  const navigateToSeries = (direction: 'next' | 'prev') => {
    const newSeriesIndex = direction === 'next' ? 
      currentSeriesIndex + 1 : 
      currentSeriesIndex - 1;

    if (newSeriesIndex >= 0 && newSeriesIndex < seriesOrder.length) {
      const nextSeriesTitle = seriesOrder[newSeriesIndex];
      const firstEpisode = series[nextSeriesTitle][0];
      navigate(`/video/${firstEpisode.content_id}`, { state: { video: firstEpisode } });
      initializePlayer(firstEpisode);
      setCurrentSeriesIndex(newSeriesIndex);
      setCurrentVideoIndex(0);
      setCurrentSeriesEpisodes(series[nextSeriesTitle]);
    }
  };

  // Handle swipe gestures
  const bind = useGesture(
    {
      onDragStart: () => {
        setIsDragging(true);
      },
      onDrag: ({ movement: [mx], direction: [dx], distance }) => {
        if (distance < 50) return; // Minimum swipe distance

        // Horizontal swipe for series navigation
        if (Math.abs(dx) > 0) {
          if (dx < 0 && currentSeriesIndex < seriesOrder.length - 1) {
            // Swipe left - next series
            navigateToSeries('next');
          } else if (dx > 0 && currentSeriesIndex > 0) {
            // Swipe right - previous series
            navigateToSeries('prev');
          }
        }
      },
      onDragEnd: () => {
        setIsDragging(false);
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

  const handleBack = () => {
    // Clean up the player
    if (playerInstanceRef.current) {
      try {
        playerInstanceRef.current.stop();
        playerInstanceRef.current.remove();
        playerInstanceRef.current = null;
      } catch (err) {
        console.error('Error during player cleanup:', err);
      }
    }
    // Navigate back to home
    navigate('/');
  };

  const handleSave = () => {
    if (isVideoSaved(video.content_id)) {
      removeFromSavedVideos(video.content_id);
    } else {
      addToSavedVideos(video);
    }
  };

  const handleEpisodeSelect = (episode: VideoData) => {
    setShowEpisodesModal(false);
    if (episode.content_id !== video.content_id) {
      navigate(`/video/${episode.content_id}`, { state: { video: episode } });
      initializePlayer(episode);
    }
  };

  const qualities = ['1080p', '720p', '480p', '360p'];

  return (
    <div 
      className="fixed inset-0 bg-black touch-none"
      {...bind()}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="text-white mr-4"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-medium text-lg line-clamp-1">
            {video.title}
          </h1>
        </div>
      </div>

      {/* Video Player */}
      <div className="h-full w-full">
        {!isPlayerLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-lg">Loading video player...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-10">
            <div className="text-center bg-red-900 bg-opacity-20 p-6 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}
        
        <div 
          id="jwplayer-container" 
          ref={playerRef}
          className="w-full h-full"
        />
      </div>

      {/* Next Video Indicator */}
      {nextVideo && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
            <ChevronDown className="w-5 h-5 text-white mr-2 animate-bounce" />
            <span className="text-white text-sm">Next episode at end</span>
          </div>
        </div>
      )}

      {/* Right Side Controls */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-20">
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
          <span className="text-xs mt-1">
            {isVideoSaved(video.content_id) ? 'Saved' : 'Save'}
          </span>
        </button>
        
        <button 
          className="text-white flex flex-col items-center"
          onClick={() => setShowShareModal(true)}
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

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal 
          video={video} 
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {/* Episodes Modal */}
      {showEpisodesModal && currentSeriesEpisodes.length > 0 && (
        <EpisodesModal
          episodes={currentSeriesEpisodes}
          currentEpisode={video}
          onSelectEpisode={handleEpisodeSelect}
          onClose={() => setShowEpisodesModal(false)}
        />
      )}

      {/* Swipe Indicators */}
      {isDragging && (
        <>
          {currentSeriesIndex > 0 && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full">
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
          )}
          {currentSeriesIndex < seriesOrder.length - 1 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full">
              <ChevronLeft className="w-6 h-6 text-white transform rotate-180" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayerPage;