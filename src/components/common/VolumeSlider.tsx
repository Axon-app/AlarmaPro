import React from 'react';

interface VolumeSliderProps {
  volume: number;
  onChange: (volume: number) => void;
  className?: string;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-300">🔈</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
      <span className="text-sm text-gray-300">🔊</span>
      <span className="text-xs text-gray-400 min-w-[3rem]">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
};
