import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'small', animated = true }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-16 md:h-20'
  };

  // Start animation after component mounts
  useEffect(() => {
    if (animated) {
      // Start animation with a slight delay
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [animated]);

  // Restart animation periodically
  useEffect(() => {
    if (!animated) return;
    
    const intervalId = setInterval(() => {
      setIsAnimating(false);
      // Small delay before starting animation again
      setTimeout(() => setIsAnimating(true), 100);
    }, 10000); // Restart animation every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [animated]);

  return (
    <div className={`flex items-center ${className} logo-container`}>
      <div className="relative">
        <img 
          src="/src/pages/logo/heartblood.png" 
          alt="ShortDrama Logo" 
          className={`${sizeClasses[size]} object-contain ${animated ? 'heartblood-logo' : ''}`}
        />
        
        {animated && (
          <div 
            className={`absolute inset-0 blood-drip ${isAnimating ? 'animate-blood' : ''}`}
            style={{
              maskImage: `url('/src/pages/logo/heartblood.png')`,
              WebkitMaskImage: `url('/src/pages/logo/heartblood.png')`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Logo;