import React from 'react';

interface TimeFormatToggleProps {
  is24Hour: boolean;
  onToggle: () => void;
  isDarkMode?: boolean;
  accentHex?: string; // theme accent as hex for background tint
  className?: string;
}

export const TimeFormatToggle: React.FC<TimeFormatToggleProps> = ({
  is24Hour,
  onToggle,
  isDarkMode = true,
  accentHex,
  className = '',
}) => {
  const trackBg = isDarkMode ? 'bg-white/10' : 'bg-black/10';
  const borderClr = isDarkMode ? 'border-white/20' : 'border-black/10';
  const textClr = isDarkMode ? 'text-white' : 'text-gray-800';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={is24Hour}
      aria-label="Cambiar formato horario"
      className={`relative inline-flex items-center justify-between ${trackBg} ${borderClr} ${textClr} rounded-full h-9 w-28 px-3 select-none border overflow-hidden ${className}`}
    >
      {/* Sliding oval highlight behind the text */}
      <div
        className={`absolute top-1 bottom-1 w-[52%] rounded-full transition-all duration-200`}
        style={{
          left: is24Hour ? 4 : undefined,
          right: is24Hour ? undefined : 4,
          background: accentHex
            ? `linear-gradient(135deg, ${accentHex}33, ${accentHex}55)`
            : (isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
          boxShadow: isDarkMode ? 'inset 0 0 0 1px rgba(255,255,255,0.15)' : 'inset 0 0 0 1px rgba(0,0,0,0.08)'
        }}
      />
      <span className="text-sm font-semibold z-10">24h</span>
      <span className="text-sm font-semibold z-10">12h</span>
    </button>
  );
};
