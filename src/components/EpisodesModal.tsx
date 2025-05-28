import React from 'react';
import { X } from 'lucide-react';
import { VideoData } from '../types';

interface EpisodesModalProps {
  episodes: VideoData[];
  currentEpisode: VideoData;
  onSelectEpisode: (episode: VideoData) => void;
  onClose: () => void;
}

const EpisodesModal: React.FC<EpisodesModalProps> = ({
  episodes,
  currentEpisode,
  onSelectEpisode,
  onClose
}) => {
  // Sort episodes by display_order
  const sortedEpisodes = [...episodes].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-end">
      <div 
        className="w-full bg-gradient-to-t from-[#1a0a1a] to-[#2a0a2a] rounded-t-[2rem] transform transition-transform duration-300 ease-out"
        style={{ maxHeight: '75vh' }}
      >
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Episodes</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <p className="text-pink-500 text-sm mt-1">
            {currentEpisode.collection_title}
          </p>
        </div>

        {/* Episodes grid */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(75vh - 5rem)' }}>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {sortedEpisodes.map((episode) => {
              const isCurrentEpisode = episode.content_id === currentEpisode.content_id;
              
              return (
                <button
                  key={episode.content_id}
                  onClick={() => onSelectEpisode(episode)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                    isCurrentEpisode
                      ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/20 scale-105'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-2xl font-bold">
                    {episode.display_order}
                  </span>
                  {isCurrentEpisode && (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-wider text-pink-500 font-medium">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodesModal;