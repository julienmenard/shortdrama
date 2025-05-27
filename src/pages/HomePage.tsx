import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import VideoCard from '../components/VideoCard';
import { VideoData } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import { Search } from 'lucide-react';
import RubricChip from '../components/RubricChip';
import { fetchRubrics, GalaxyRubric, searchContent } from '../api';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';

const HomePage = () => {
  const [activeRubricId, setActiveRubricId] = useState<string>('');
  const [rubrics, setRubrics] = useState<GalaxyRubric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<VideoData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const loadRubrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchRubrics();
        const filteredRubrics = response.data.data.filter(rubric => 
          rubric.rubric_label !== 'GETBRIZ' && 
          rubric.rubric_title !== 'GETBRIZ'
        );
        setRubrics(filteredRubrics);
      } catch (error) {
        console.error('Failed to load rubrics:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadRubrics();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setIsSearching(false);
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      setSearchError(null);
      setIsSearching(true);

      try {
        const response = await searchContent(searchTerm);
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Failed to perform search');
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleVideoSelect = (video: VideoData) => {
    navigate(`/video/${video.content_id}`, { state: { video } });
  };

  const clearActiveRubric = () => {
    setActiveRubricId('');
  };

  const getIconForRubric = (rubricTitle: string) => {
    return undefined;
  };

  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      );
    }

    if (searchError) {
      return (
        <div className="p-6 bg-red-900 bg-opacity-20 rounded-lg text-center">
          <p className="text-red-400">{searchError}</p>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <p className="text-xl mb-2">{t('common.noResults')}</p>
            <p className="text-sm">{t('common.tryDifferentSearch')}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[rgb(var(--foreground))]">
          {t('common.searchResultsFor')} "{searchTerm}"
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {searchResults.map((video) => (
            <VideoCard
              key={video.content_id}
              video={video}
              onClick={() => handleVideoSelect(video)}
            />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] pb-20">
      <div className="sticky top-0 z-10 bg-[rgb(var(--background))] bg-opacity-95 pt-3 pb-2 px-4">
        <div className="flex items-center justify-center mb-4">
          <Logo />
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        {!isSearching && (
          loading ? (
            <div className="flex space-x-4 pb-2 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="h-9 w-24 bg-gray-800 animate-pulse rounded-full"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm py-2">{error}</div>
          ) : (
            <div className="flex items-center overflow-x-auto space-x-4 pb-2 scrollbar-hide">
              {!activeRubricId && (
                <RubricChip
                  label={t('common.all')}
                  isActive={!activeRubricId}
                  onClick={() => {}}
                  isHome={true}
                />
              )}
              {rubrics.map(rubric => (
                <RubricChip
                  key={rubric.rubric_id}
                  label={rubric.rubric_label || rubric.rubric_title}
                  icon={getIconForRubric(rubric.rubric_title)}
                  isActive={activeRubricId === rubric.rubric_id}
                  onClick={() => setActiveRubricId(
                    activeRubricId === rubric.rubric_id ? '' : rubric.rubric_id
                  )}
                  onClear={activeRubricId === rubric.rubric_id ? clearActiveRubric : undefined}
                />
              ))}
            </div>
          )
        )}
      </div>

      <div className="px-4">
        {isSearching ? (
          renderSearchResults()
        ) : (
          <VideoGrid 
            onSelectVideo={handleVideoSelect}
            rubricId={activeRubricId}
            rubrics={rubrics}
          />
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default HomePage;