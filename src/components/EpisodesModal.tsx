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

        {/* Episodes list */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(75vh - 5rem)' }}>
          <div className="grid grid-cols-1 gap-3">
            {sortedEpisodes.map((episode) => {
              const isCurrentEpisode = episode.content_id === currentEpisode.content_id;
              
              return (
                <button
                  key={episode.content_id}
                  onClick={() => onSelectEpisode(episode)}
                  className={`relative p-4 rounded-xl flex items-center transition-all duration-300 ${
                    isCurrentEpisode
                      ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 mr-4">
                    <span className="font-bold">
                      {episode.display_order}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium line-clamp-2">{episode.title}</p>
                    <p className="text-xs opacity-75 mt-1">{Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}</p>
                  </div>
                  {isCurrentEpisode && (
                    <span className="ml-2 text-xs uppercase tracking-wider text-pink-200 font-medium bg-pink-500/30 px-2 py-1 rounded-full">
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