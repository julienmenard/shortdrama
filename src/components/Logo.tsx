import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'small' }) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-16 md:h-20'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/src/pages/logo/heartblood.png" 
        alt="ShortDrama Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;