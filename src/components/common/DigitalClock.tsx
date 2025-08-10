import React from 'react';
import type { ThemeType } from '../../types';
import { formatTime, formatDate } from '../../utils';
import { ThemeWaves } from './ThemeWaves';
import { Card } from '../ui';

interface DigitalClockProps {
  currentTime: Date;
  is24HourFormat: boolean;
  isDarkMode: boolean;
  voiceEnabled?: boolean;
  theme: { accent: string };
  themeType: ThemeType;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  currentTime,
  is24HourFormat,
  isDarkMode,
  voiceEnabled = false,
  themeType
}) => {
  return (
    <Card 
      className="inline-block w-full sm:w-auto p-4 sm:p-6 md:p-8 transform hover:scale-105 transition-all duration-500"
      isDarkMode={isDarkMode}
    >
      <div className={`text-5xl sm:text-6xl md:text-7xl font-mono font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-wider`}>
        {formatTime(currentTime, is24HourFormat)}
      </div>
      
      {/* Theme-specific Waves */}
      <div className="flex justify-center mb-4">
        <ThemeWaves theme={themeType} isDarkMode={isDarkMode} />
      </div>
      
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <span className={`text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full ${isDarkMode ? 'bg-purple-600/30 text-purple-300' : 'bg-purple-600/20 text-purple-800'}`}>
          {is24HourFormat ? '24 Horas' : '12 Horas'}
        </span>
        {voiceEnabled && (
          <span className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-green-600/30 text-green-300 animate-pulse">
            🎤 Voz Activa
          </span>
        )}
      </div>
      
      <div className={`text-sm sm:text-base md:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {formatDate(currentTime)}
      </div>
    </Card>
  );
};
