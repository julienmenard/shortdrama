import React from 'react';
import { SeriesData } from '../types';
import { Calendar, Play } from 'lucide-react';

interface SeriesCardProps {
  series: SeriesData;
  onClick: () => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, onClick }) => {
  const coverImage = series.assets.cover[0]?.url || 'https://via.placeholder.com/300x400';
  
  // Determine genre from keywords
  const getGenre = (keywords: string[]): string => {
    const genreKeywords = ['romance', 'drama', 'comedy', 'action', 'thriller', 'horror'];
    const matchedGenre = keywords.find(keyword => 
      genreKeywords.some(genre => keyword.toLowerCase().includes(genre))
    );
    return matchedGenre ? matchedGenre.trim() : 'Drama';
  };
  
  const genre = getGenre(series.keywords);

  return (
    <div 
      className="relative bg-transparent rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform cursor-pointer hover:shadow-pink-500/30 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={coverImage} 
          alt={series.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-pink-500 rounded-full p-3 transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
            <Play className="w-6 h-6 text-white" fill="white" />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {series.content_type === "series" ? "SERIES" : "MOVIE"}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <div className="flex items-center text-sm text-gray-300 space-x-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{genre}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="font-medium text-xs text-white line-clamp-1">{series.title}</h3>
      </div>
    </div>
  );
};

export default SeriesCard;