import React from 'react';
import { ALARM_SOUNDS } from '../../constants/alarmSounds.ts';
import type { AlarmSound } from '../../constants/alarmSounds.ts';

interface AlarmSoundsProps {
  selectedSound: string;
  onSoundChange: (sound: string) => void;
  className?: string;
}

export const AlarmSounds: React.FC<AlarmSoundsProps> = ({
  selectedSound,
  onSoundChange,
  className = ''
}) => {
  const playPreview = (soundUrl: string) => {
    const audio = new Audio(soundUrl);
    audio.volume = 0.3;
    audio.play().catch(console.error);
    setTimeout(() => audio.pause(), 1000);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Sonido de Alarma
      </label>
      <div className="grid grid-cols-1 gap-2">
  {ALARM_SOUNDS.map((sound: AlarmSound) => (
          <div
            key={sound.name}
            className={`
              flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
              ${selectedSound === sound.url 
                ? 'bg-purple-500/20 border-purple-500/50 shadow-glow' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
              }
            `}
            onClick={() => onSoundChange(sound.url)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{sound.icon}</span>
              <span className="text-sm text-gray-300">{sound.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playPreview(sound.url);
              }}
              className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 rounded bg-purple-500/20"
            >
              Vista Previa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
