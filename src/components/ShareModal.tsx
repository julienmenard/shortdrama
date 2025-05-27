import React from 'react';
import { Facebook, Twitter, MessageCircle, X } from 'lucide-react';
import { VideoData } from '../types';

interface ShareModalProps {
  video: VideoData;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ video, onClose }) => {
  const shareUrl = window.location.href;
  const shareText = `Check out "${video.title}" on ShortDrama!`;
  const hashTags = ['ShortDrama', 'Drama', 'Series'].join(',');

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}&hashtags=${hashTags}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  const socialButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      onClick: shareToFacebook
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2]',
      onClick: shareToTwitter
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      onClick: shareToWhatsApp
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 animate-fade-in">
      <div className="w-full max-w-lg bg-gray-900 rounded-t-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Share</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {socialButtons.map((button) => (
            <button
              key={button.name}
              onClick={button.onClick}
              className="flex flex-col items-center"
            >
              <div className={`${button.color} p-4 rounded-full mb-2`}>
                <button.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-300">{button.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center bg-gray-800 rounded-lg p-3">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-white text-sm outline-none"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="ml-2 px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;