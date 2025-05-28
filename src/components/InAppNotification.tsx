import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

interface InAppNotificationProps {
  title: string;
  body: string;
  icon?: string;
  duration?: number;
  onClose: () => void;
  onClick?: () => void;
}

const InAppNotification: React.FC<InAppNotificationProps> = ({
  title,
  body,
  icon,
  duration = 5000,
  onClose,
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in after a short delay
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Close automatically after duration
    const closeTimeout = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(closeTimeout);
    };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    handleClose();
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-md px-2 pt-2">
        <div 
          className="bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden p-3 flex items-center"
          onClick={handleClick}
        >
          <div className="flex-shrink-0 mr-3">
            {icon ? (
              <img src={icon} alt="" className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{title}</h4>
            <p className="text-gray-300 text-xs line-clamp-2">{body}</p>
          </div>
          <button 
            className="ml-2 text-gray-400 hover:text-white p-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InAppNotification;