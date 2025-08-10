import React from 'react';
import { Alarm, ThemeType } from '../../types';
import { formatAlarmTime, getPriorityColor, getPriorityLabel } from '../../utils';
import { ALARM_SOUNDS, WEEK_DAYS } from '../../constants';
import { Card, Button } from '../ui';
// Icons would be imported here: import { Settings, Play, Pause, Trash2, Volume2 } from 'lucide-react';

interface AlarmItemProps {
  alarm: Alarm;
  isDarkMode: boolean;
  is24HourFormat: boolean;
  theme: {
    accent: string;
  };
  themeType: ThemeType;
  onEdit: (alarm: Alarm) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const AlarmItem: React.FC<AlarmItemProps> = ({
  alarm,
  isDarkMode,
  is24HourFormat,
  themeType,
  onEdit,
  onToggle,
  onDelete
}) => {
  return (
    <Card 
      className="group p-4 sm:p-6 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl"
      isDarkMode={isDarkMode}
    >
      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 sm:gap-4 mb-2 flex-wrap">
            <div className={`text-3xl sm:text-4xl font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-wide`}>
              {formatAlarmTime(alarm.time, is24HourFormat)}
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getPriorityColor(alarm.priority, isDarkMode)} text-white shadow-lg`}>
              {getPriorityLabel(alarm.priority)}
            </div>
          </div>
          
          <div className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {alarm.label}
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔊</span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {ALARM_SOUNDS[alarm.sound]?.name}
              </span>
            </div>
            
            {alarm.vibrate && (
              <span className={`px-2 py-1 rounded-md text-xs ${isDarkMode ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-200 text-blue-800'}`}>
                📳 Vibrar
              </span>
            )}
            
            {alarm.gradualWake && (
              <span className={`px-2 py-1 rounded-md text-xs ${isDarkMode ? 'bg-orange-600/30 text-orange-300' : 'bg-orange-200 text-orange-800'}`}>
                🌅 Gradual
              </span>
            )}
            
            {alarm.challengeMode && (
              <span className={`px-2 py-1 rounded-md text-xs ${isDarkMode ? 'bg-red-600/30 text-red-300' : 'bg-red-200 text-red-800'}`}>
                🧩 Desafío
              </span>
            )}
          </div>
          
          {alarm.days.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
              {alarm.days.map(day => (
                <span
                  key={day}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-purple-600/30 text-purple-300' : 'bg-purple-600/20 text-purple-800'} shadow-sm`}
                >
                  {WEEK_DAYS[day]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(alarm)}
            className="p-3 sm:p-4 hover:scale-110"
            title="Editar alarma"
            isDarkMode={isDarkMode}
            themeType={themeType}
          >
            {/* <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> */}
            ⚙️
          </Button>
          
          <Button
            variant={alarm.enabled ? "primary" : "ghost"}
            size="sm"
            onClick={() => onToggle(alarm.id)}
            className="p-3 sm:p-4 hover:scale-110"
            title={alarm.enabled ? 'Desactivar' : 'Activar'}
            isDarkMode={isDarkMode}
            themeType={themeType}
          >
            {alarm.enabled ? '⏸️' : '▶️'}
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(alarm.id)}
            className="p-3 sm:p-4 hover:scale-110"
            title="Eliminar alarma"
            isDarkMode={isDarkMode}
            themeType={themeType}
          >
            🗑️
          </Button>
        </div>
      </div>
    </Card>
  );
};
