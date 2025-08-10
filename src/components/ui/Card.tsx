import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  isDarkMode?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  isDarkMode = true
}) => {
  const baseClasses = 'rounded-2xl sm:rounded-3xl shadow-xl border transition-all duration-300';
  
  const variants = {
    default: isDarkMode 
      ? 'bg-white/10 border-white/20 backdrop-blur-lg shadow-2xl' 
      : 'bg-white/50 border-white/40 backdrop-blur-lg shadow-2xl',
    glass: isDarkMode 
      ? 'bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl hover:shadow-3xl' 
      : 'bg-white/40 border-white/40 backdrop-blur-xl shadow-2xl hover:shadow-3xl',
    solid: isDarkMode 
      ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm shadow-2xl' 
      : 'bg-white/90 border-gray-200 backdrop-blur-sm shadow-2xl'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
