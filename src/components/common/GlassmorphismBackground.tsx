import React from 'react';

interface GlassmorphismBackgroundProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}

export const GlassmorphismBackground: React.FC<GlassmorphismBackgroundProps> = ({
  children,
  className = '',
  intensity = 'medium'
}) => {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'light':
        return 'bg-white/5 backdrop-blur-sm border-white/10';
      case 'medium':
        return 'bg-white/10 backdrop-blur-md border-white/20';
      case 'strong':
        return 'bg-white/15 backdrop-blur-lg border-white/30';
      default:
        return 'bg-white/10 backdrop-blur-md border-white/20';
    }
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border
      ${getIntensityClasses()}
      shadow-2xl
      before:absolute before:inset-0
      before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent
      before:rounded-2xl before:pointer-events-none
      ${className}
    `}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-blue-500/5 rounded-2xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
