import React from 'react';
import type { ThemeType } from '../../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  // When provided, allows the component to adapt contrast for light/dark themes
  isDarkMode?: boolean;
  // Optional theme to colorize the primary variant according to current theme
  themeType?: ThemeType;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDarkMode,
  themeType = 'purple',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 transform sm:hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  // Static Tailwind class maps (safe for JIT) to avoid broken inline gradients
  const themePrimary: Record<ThemeType, string> = {
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-600 focus:ring-purple-500 hover:from-purple-700 hover:to-indigo-700',
    ocean: 'bg-gradient-to-r from-blue-600 to-cyan-600 focus:ring-blue-500 hover:from-blue-700 hover:to-cyan-700',
    sunset: 'bg-gradient-to-r from-orange-600 to-red-500 focus:ring-orange-500 hover:from-orange-700 hover:to-red-600',
    forest: 'bg-gradient-to-r from-green-600 to-emerald-600 focus:ring-green-500 hover:from-green-700 hover:to-emerald-700',
    cosmic: 'bg-gradient-to-r from-violet-600 to-rose-600 focus:ring-violet-500 hover:from-violet-700 hover:to-rose-700',
  };

  const themeSecondaryLight: Record<ThemeType, string> = {
    purple: 'bg-white text-gray-900 border border-purple-400 hover:bg-gray-50 focus:ring-purple-400',
    ocean: 'bg-white text-gray-900 border border-blue-400 hover:bg-gray-50 focus:ring-blue-400',
    sunset: 'bg-white text-gray-900 border border-orange-400 hover:bg-gray-50 focus:ring-orange-400',
    forest: 'bg-white text-gray-900 border border-green-400 hover:bg-gray-50 focus:ring-green-400',
    cosmic: 'bg-white text-gray-900 border border-violet-400 hover:bg-gray-50 focus:ring-violet-400',
  };

  const themeGhostLight: Record<ThemeType, string> = {
    purple: 'bg-purple-50/40 hover:bg-purple-50 text-purple-700 border border-purple-200 focus:ring-purple-300',
    ocean: 'bg-blue-50/40 hover:bg-blue-50 text-blue-700 border border-blue-200 focus:ring-blue-300',
    sunset: 'bg-orange-50/40 hover:bg-orange-50 text-orange-700 border border-orange-200 focus:ring-orange-300',
    forest: 'bg-green-50/40 hover:bg-green-50 text-green-700 border border-green-200 focus:ring-green-300',
    cosmic: 'bg-violet-50/40 hover:bg-violet-50 text-violet-700 border border-violet-200 focus:ring-violet-300',
  };

  const variants = {
    primary: `${themePrimary[themeType]} text-white shadow-xl hover:shadow-2xl`,
    // Adapt contrast for light vs dark and tint by theme in light mode
    secondary: isDarkMode === false
      ? `${themeSecondaryLight[themeType]} shadow-md`
      : 'bg-white/15 hover:bg-white/25 backdrop-blur-lg text-white border border-white/20 focus:ring-white/50',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:ring-red-500 shadow-xl hover:shadow-2xl',
    ghost: isDarkMode === false
      ? themeGhostLight[themeType]
      : 'bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white border border-white/10 focus:ring-white/50'
  } as const;
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
  // no inline styles needed; all styles are Tailwind class-based
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
