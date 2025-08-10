import React, { useMemo, useRef, useState, useEffect } from 'react';
import type { ThemeType } from '../../types';
import { THEME_EMOJI, THEME_ACCENT_GRADIENT_HEX } from '../../constants';

interface ThemeSelectProps {
  value: ThemeType;
  onChange: (theme: ThemeType) => void;
  isDarkMode: boolean;
}

const THEME_LABELS: Record<ThemeType, string> = {
  purple: 'Púrpura',
  ocean: 'Océano',
  sunset: 'Atardecer',
  forest: 'Bosque',
  cosmic: 'Cósmico',
};

export const ThemeSelect: React.FC<ThemeSelectProps> = ({ value, onChange, isDarkMode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Attach listeners only while the menu is open to avoid interference with the toggle click
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const gradient = useMemo(() => THEME_ACCENT_GRADIENT_HEX[value], [value]);

  const buttonStyle: React.CSSProperties = {
    // subtle theme tint + translucent base to match light/dark
    backgroundImage: `linear-gradient(135deg, ${gradient.start}22, ${gradient.end}1A)`,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.12)' : `${gradient.start}55`,
  };

  const listStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${gradient.start}29, ${gradient.end}1F)`,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.12)' : `${gradient.start}55`,
  };

  return (
    <div ref={ref} className="relative inline-block pointer-events-auto">
      <button
        type="button"
        className={`h-8 px-3 pr-8 rounded-xl text-sm flex items-center gap-2 border backdrop-blur-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        style={buttonStyle}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">{THEME_EMOJI[value]}</span>
        <span className="font-medium">{THEME_LABELS[value]}</span>
        <span className={`absolute right-2 ${isDarkMode ? 'text-white/80' : 'text-gray-700/80'}`}>▾</span>
      </button>

      {open && (
        <div
          className={`absolute z-[9999] mt-2 w-44 rounded-xl shadow-2xl border overflow-hidden ${isDarkMode ? 'backdrop-blur-xl' : 'backdrop-blur-xl'}`}
          style={listStyle}
          role="listbox"
        >
          {(Object.keys(THEME_LABELS) as ThemeType[]).map((k) => {
            const selected = k === value;
            return (
              <button
                key={k}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => { onChange(k); setOpen(false); }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 text-sm transition-colors ${
                  isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-gray-800'
                } ${selected ? (isDarkMode ? 'bg-white/10' : 'bg-black/10') : ''}`}
              >
                <span className="text-lg">{THEME_EMOJI[k]}</span>
                <span className="font-medium">{THEME_LABELS[k]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSelect;
