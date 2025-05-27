import React from 'react';

interface RubricChipProps {
  label: string;
  icon?: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  isHome?: boolean;
  onClear?: () => void;
}

const RubricChip: React.FC<RubricChipProps> = ({ 
  label, 
  icon: Icon, 
  isActive, 
  onClick,
  isHome = false,
  onClear
}) => {
  // Don't show GETBRIZ chips
  if (label === 'GETBRIZ') return null;

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? 'bg-pink-600 text-white'
          : 'text-gray-400 bg-gray-800 hover:bg-gray-700'
      }`}
    >
      {isActive && onClear && (
        <svg 
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="w-4 h-4 mr-2 hover:text-gray-200" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      )}
      {Icon && <Icon className="h-3.5 w-3.5 mr-1" />}
      <span>{label}</span>
    </button>
  );
};

export default RubricChip;