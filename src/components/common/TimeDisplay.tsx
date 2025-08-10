import React from 'react';

interface TimeDisplayProps {
  time: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  className = '',
  size = 'md'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-lg';
      case 'md':
        return 'text-2xl';
      case 'lg':
        return 'text-4xl';
      case 'xl':
        return 'text-6xl';
      default:
        return 'text-2xl';
    }
  };

  return (
    <div className={`
      font-mono font-bold tracking-wider
      ${getSizeClasses()}
      bg-gradient-to-r from-white to-gray-300
      bg-clip-text text-transparent
      ${className}
    `}>
      {time}
    </div>
  );
};
