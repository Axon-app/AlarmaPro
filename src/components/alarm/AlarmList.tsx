import React from 'react';
import { Alarm } from '../../types';
import { AlarmItem } from './AlarmItem';
// Import { Clock, Sparkles } from 'lucide-react';

interface AlarmListProps {
  alarms: Alarm[];
  isDarkMode: boolean;
  is24HourFormat: boolean;
  theme: {
    accent: string;
  };
  onEdit: (alarm: Alarm) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  isDarkMode,
  is24HourFormat,
  theme,
  onEdit,
  onToggle,
  onDelete
}) => {
  if (alarms.length === 0) {
    return (
      <div className={`text-center py-10 sm:py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="relative">
          {/* <Clock className="w-24 h-24 mx-auto mb-6 opacity-50 animate-pulse" /> */}
          <div className="w-24 h-24 mx-auto mb-6 opacity-50 animate-pulse text-6xl">⏰</div>
          {/* <Sparkles className="absolute top-0 right-1/2 w-6 h-6 text-yellow-400 animate-ping" /> */}
          <div className="absolute top-0 right-1/2 w-6 h-6 text-yellow-400 animate-ping text-2xl">✨</div>
        </div>
  <p className="text-xl sm:text-2xl font-semibold mb-2">No hay alarmas configuradas</p>
  <p className="text-base sm:text-lg mb-2">¡Crea tu primera alarma inteligente!</p>
  <p className="text-sm text-gray-400">Usa los botones de arriba para empezar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-1 sm:px-0">
      {alarms.map((alarm) => (
        <AlarmItem
          key={alarm.id}
          alarm={alarm}
          isDarkMode={isDarkMode}
          is24HourFormat={is24HourFormat}
          theme={theme}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
