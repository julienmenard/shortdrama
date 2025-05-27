import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { fetchVideos, GalaxyRubric } from '../api';
import { VideoData } from '../types';
import VideoCard from './VideoCard';
import CollectionHeader from './CollectionHeader';
import { useTranslation } from 'react-i18next';

interface VideoGridProps {
  onSelectVideo: (video: VideoData) => void;
  rubricId?: string;
  rubrics?: GalaxyRubric[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ onSelectVideo, rubricId, rubrics }) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rubricVideos, setRubricVideos] = useState<Record<string, VideoData[]>>({});
  const [featuredVideo, setFeaturedVideo] = useState<VideoData | null>(null);
  const { t } = useTranslation();

  // Filter videos to only include the first episode of each collection
  const filterFirstEpisodes = (videoList: VideoData[]): VideoData[] => {
    const collections: Record<string, VideoData> = {};
    
    videoList.forEach(video => {
      const collectionKey = video.collection_title;
      const isFirstSeason = video.title.includes('S01');
      
      if (isFirstSeason) {
        if (!collections[collectionKey] || 
            getEpisodeNumber(video.title) < getEpisodeNumber(collections[collectionKey].title)) {
          collections[collectionKey] = video;
        }
      }
    });
    
    return Object.values(collections);
  };
  
  const getEpisodeNumber = (title: string): number => {
    const match = title.match(/E(\d+)/);
    return match ? parseInt(match[1]) : 999;
  };

  // Fetch videos for the selected rubric or all videos
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchVideos(rubricId);
        
        if (response.data.data.length > 0) {
          const filteredVideos = !rubricId 
            ? filterFirstEpisodes(response.data.data)
            : response.data.data;
            
          setVideos(filteredVideos);
          setFeaturedVideo(filteredVideos[0]);
        } else {
          setVideos([]);
          setFeaturedVideo(null);
        }
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [rubricId]);

  // Fetch videos for each rubric
  useEffect(() => {
    if (!rubrics || rubrics.length === 0 || rubricId) return;

    const loadRubricVideos = async () => {
      try {
        const newRubricVideos: Record<string, VideoData[]> = {};
        
        // Filter out GETBRIZ rubric
        const filteredRubrics = rubrics.filter(rubric => 
          rubric.rubric_label !== 'GETBRIZ' && 
          rubric.rubric_title !== 'GETBRIZ'
        );
        
        for (const rubric of filteredRubrics) {
          try {
            const response = await fetchVideos(rubric.rubric_id);
            if (response.data.data.length > 0) {
              const filteredVideos = filterFirstEpisodes(response.data.data);
              newRubricVideos[rubric.rubric_id] = filteredVideos;
            }
          } catch (error) {
            console.error(`Error fetching videos for rubric ${rubric.rubric_id}:`, error);
          }
        }
        
        setRubricVideos(newRubricVideos);
      } catch (err) {
        console.error('Error loading rubric videos:', err);
      }
    };

    loadRubricVideos();
  }, [rubrics, rubricId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-900 bg-opacity-20 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (videos.length === 0 && Object.keys(rubricVideos).length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-400">{t('common.noVideos')}</p>
      </div>
    );
  }

  // If a specific rubric is selected, show videos for that rubric
  if (rubricId) {
    const selectedRubric = rubrics?.find(r => r.rubric_id === rubricId);
    const rubricTitle = selectedRubric?.rubric_label || t('common.videos');
    
    return (
      <div className="space-y-8">
        {featuredVideo && (
          <div 
            className="relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[16/9] mb-6 cursor-pointer"
            onClick={() => onSelectVideo(featuredVideo)}
          >
            <img 
              src={featuredVideo.assets.cover[0]?.url} 
              alt={featuredVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent">
              <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                {t('common.trending')}
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h2 className="text-white text-xl font-bold mb-1">{featuredVideo.title}</h2>
                <div className="flex items-center">
                  <div className="bg-pink-600 rounded-full w-10 h-10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <CollectionHeader title={rubricTitle} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {videos.map((video) => (
              <VideoCard
                key={video.content_id}
                video={video}
                onClick={() => onSelectVideo(video)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no specific rubric is selected, show sections by rubric
  return (
    <div className="space-y-8">
      {featuredVideo && (
        <div 
          className="relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[16/9] mb-6 cursor-pointer"
          onClick={() => onSelectVideo(featuredVideo)}
        >
          <img 
            src={featuredVideo.assets.cover[0]?.url} 
            alt={featuredVideo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent">
            <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
              {t('common.trending')}
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4">
              <h2 className="text-white text-xl font-bold mb-1">{featuredVideo.title}</h2>
              <div className="flex items-center">
                <div className="bg-pink-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {rubrics?.filter(rubric => 
        rubric.rubric_label !== 'GETBRIZ' && 
        rubric.rubric_title !== 'GETBRIZ'
      ).map((rubric) => {
        const rubricVideosList = rubricVideos[rubric.rubric_id] || [];
        if (rubricVideosList.length === 0) return null;
        
        return (
          <div key={rubric.rubric_id} className="space-y-3">
            <CollectionHeader title={rubric.rubric_label} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {rubricVideosList.slice(0, 5).map((video) => (
                <VideoCard
                  key={video.content_id}
                  video={video}
                  onClick={() => onSelectVideo(video)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoGrid;