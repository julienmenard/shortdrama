import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import RubricChip from '../components/RubricChip';
import { fetchRubrics, GalaxyRubric, searchContent, fetchSeries } from '../api';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';
import BottomNavigation from '../components/BottomNavigation';
import CollectionHeader from '../components/CollectionHeader';
import SeriesCard from '../components/SeriesCard';
import { SeriesData } from '../types';

const HomePage = () => {
  const [activeRubricId, setActiveRubricId] = useState<string>('');
  const [rubrics, setRubrics] = useState<GalaxyRubric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SeriesData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [seriesData, setSeriesData] = useState<SeriesData[]>([]);
  const [featuredSeries, setFeaturedSeries] = useState<SeriesData | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch rubrics
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

  // Fetch series data
  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchSeries(activeRubricId);
        if (response.code === 200 && response.data && response.data.length > 0) {
          const series = response.data;
          setSeriesData(series);
          
          // Set featured series to the first item
          if (series.length > 0) {
            setFeaturedSeries(series[0]);
          }
        } else {
          setSeriesData([]);
          setFeaturedSeries(null);
        }
      } catch (error) {
        console.error('Failed to load series:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSeries();
  }, [activeRubricId]);

  // Handle search
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
        if (response.code === 200 && response.data && response.data.data) {
          // Convert VideoData to SeriesData format for consistency
          const seriesResults = response.data.data.map(video => ({
            title: video.collection_title || video.title,
            description: video.description,
            keywords: [],
            sales_mode: [],
            rubric_id: [],
            classification: [],
            assets: video.assets,
            content_id: video.content_id,
            content_type: video.content_type
          }));
          setSearchResults(seriesResults);
        } else {
          setSearchResults([]);
        }
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

  const handleSeriesSelect = (series: SeriesData) => {
    // Navigate to the series detail page or episodes list
    if (series.content_id) {
      navigate(`/video/${series.content_id}`, { state: { series } });
    }
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
          {searchResults.map((series, index) => (
            <SeriesCard
              key={`search-${index}-${series.content_id || index}`}
              series={series}
              onClick={() => handleSeriesSelect(series)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderSeriesGrid = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-900 bg-opacity-20 rounded-lg text-center">
          <p className="text-red-400">{error}</p>
        </div>
      );
    }

    if (seriesData.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <p className="text-xl mb-2">{t('common.noVideos')}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Featured Series */}
        {featuredSeries && (
          <div 
            className="relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[16/9] mb-6 cursor-pointer"
            onClick={() => handleSeriesSelect(featuredSeries)}
          >
            <img 
              src={featuredSeries.assets.cover[0]?.url} 
              alt={featuredSeries.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent">
              <div className="absolute top-3 left-3 bg-gray-800/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center">
                <Search className="w-3.5 h-3.5 mr-1.5" />
                Featured
              </div>
              <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                {t('common.trending')}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                <div>
                  <h2 className="text-white text-2xl font-bold">{featuredSeries.title}</h2>
                  <p className="text-gray-300 line-clamp-2 mt-2 max-w-2xl">
                    {featuredSeries.description.substring(0, 120)}...
                  </p>
                </div>
                <div className="bg-pink-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Series */}
        <div className="space-y-3">
          <CollectionHeader title={activeRubricId ? 
            rubrics.find(r => r.rubric_id === activeRubricId)?.rubric_label || t('common.videos') 
            : "All Series"} 
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {seriesData.map((series, index) => (
              <SeriesCard
                key={`series-${index}-${series.content_id || index}`}
                series={series}
                onClick={() => handleSeriesSelect(series)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] pb-20">
      <div className="sticky top-0 z-10 bg-[rgb(var(--background))] bg-opacity-95 pt-3 pb-2 px-4">
        <div className="flex items-center justify-center mb-4">
          <Logo size="medium" />
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
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
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
        {isSearching ? renderSearchResults() : renderSeriesGrid()}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default HomePage;