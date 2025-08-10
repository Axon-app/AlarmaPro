import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ClockTimePickerProps {
  value: string; // expects "HH:MM" in 24h format
  onChange: (next: string) => void;
  isDarkMode: boolean;
  use12Hour?: boolean; // UI display only; output stays 24h string
  className?: string;
  label?: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parse24(value: string) {
  const match = /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i.exec(value || '');
  let h = 8, m = 0;
  if (match) {
    h = parseInt(match[1], 10);
    m = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    
    // Convertir 12h a 24h si se proporciona AM/PM
    if (ampm) {
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
    }
    
    h = clamp(h, 0, 23);
    m = clamp(m, 0, 59);
  } else {
    const now = new Date();
    h = now.getHours();
    m = now.getMinutes();
  }
  return { h, m };
}

function to24String(h: number, m: number) {
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

function toDisplay(h24: number, use12: boolean) {
  if (!use12) {
    return { hours: h24, ampm: '' as 'AM' | 'PM' | '' };
  }
  const ampm: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return { hours: h12, ampm };
}

function fromDisplay(hours: number, m: number, ampm: 'AM' | 'PM' | '' , use12: boolean) {
  if (!use12) return to24String(hours, m);
  let h24 = hours % 12;
  if (ampm === 'PM') h24 += 12;
  return to24String(h24, m);
}

export const ClockTimePicker: React.FC<ClockTimePickerProps> = ({
  value,
  onChange,
  isDarkMode,
  use12Hour = true,
  className = '',
  label = 'Selecciona una hora',
}) => {
  const { h, m } = useMemo(() => parse24(value), [value]);
  const disp = useMemo(() => toDisplay(h, use12Hour), [h, use12Hour]);
  const [open, setOpen] = useState(false);
  const [selHour, setSelHour] = useState(disp.hours);
  const [selMin, setSelMin] = useState(m);
  const [selAmpm, setSelAmpm] = useState<'AM' | 'PM' | ''>(disp.ampm);
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  const rootRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'hours' | 'minutes'>('hours');

  // Convert a pointer position to hour/minute and update selection
  const updateFromPointer = React.useCallback((clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ang = Math.atan2(y - cy, x - cx) * (180 / Math.PI); // -180..180, 0 at 3 o'clock
    const norm = (ang + 90 + 360) % 360; // 0 at 12 o'clock, clockwise

    if (dragMode === 'hours') {
      const steps = use12Hour ? 12 : 24;
      let idx = Math.round((norm / 360) * steps) % steps; // 0..steps-1
      let value = use12Hour ? (idx === 0 ? 12 : idx) : idx; // 0 -> 12 for 12h
      setSelHour(value);
    } else {
      let idx = Math.round((norm / 360) * 60) % 60; // 0..59
      setSelMin(idx);
    }
  }, [dragMode, use12Hour]);

  // Global pointer listeners while dragging
  useEffect(() => {
    if (!dragging) return;
    const onMove = (ev: PointerEvent) => updateFromPointer(ev.clientX, ev.clientY);
    const onUp = () => setDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp as any);
    };
  }, [dragging, updateFromPointer]);

  useEffect(() => {
    const d = toDisplay(h, use12Hour);
    setSelHour(d.hours);
    setSelMin(m);
    setSelAmpm(d.ampm);
    
    // Actualizar el valor cuando cambia el formato de hora
    if (value) {
      const newValue = fromDisplay(d.hours, m, d.ampm, use12Hour);
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  }, [value, use12Hour, h, m, onChange]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const commit = (hTmp = selHour, mTmp = selMin, aTmp = selAmpm) => {
    const next = fromDisplay(hTmp, mTmp, aTmp, use12Hour);
    onChange(next);
  };

  const ringColor = isDarkMode ? 'bg-white/10' : 'bg-black/10';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const subText = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const border = isDarkMode ? 'border-white/20' : 'border-gray-200';

  const radius = 108; // px (bigger dial, leaves margin for number chips)
  const center = 130; // container is 260x260

  const hourNumbers = useMemo(() => {
    const count = use12Hour ? 12 : 24;
    const arr = Array.from({ length: count }, (_, i) => (use12Hour ? (i + 1) : i));
    return arr;
  }, [use12Hour]);

  const minuteNumbers = useMemo(() => Array.from({ length: 12 }, (_, i) => i * 5), []);

  const angleForHour = (hr: number) => {
    const base = use12Hour ? (hr % 12) : hr; // 0..11 or 0..23
    const steps = use12Hour ? 12 : 24;
    return (base / steps) * 360 - 90; // start at top
  };
  const angleForMinute = (mm: number) => (mm / 60) * 360 - 90;

  const renderDial = () => {
    const isHours = mode === 'hours';
    const items = isHours ? hourNumbers : minuteNumbers;
    const selected = isHours ? selHour : selMin;
    const angle = isHours ? angleForHour(use12Hour ? selHour % 12 : selHour) : angleForMinute(selMin);

    const onPointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(true);
      setDragMode(mode);
      updateFromPointer(e.clientX, e.clientY);
      try {
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      } catch {}
    };

    return (
  <div
        ref={dialRef}
        onPointerDown={onPointerDown}
        className={`relative w-[260px] h-[260px] rounded-full ${ringColor} border ${border} mx-auto select-none touch-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* Pointer */}
        <div
          className="absolute left-1/2 top-1/2 origin-center"
          style={{
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          }}
        >
          {(() => {
            const pointerLen = radius; // end dot center exactly at ring radius
            const dotSize = 10; // px diameter
            return (
              <>
                <div
                  className={`${isDarkMode ? 'bg-white/70' : 'bg-gray-700/70'} absolute`}
                  style={{
                    width: `${pointerLen}px`,
                    height: '2px',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <div
                  className={`${isDarkMode ? 'bg-white' : 'bg-gray-800'} absolute rounded-full`}
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    left: `${pointerLen}px`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </>
            );
          })()}
        </div>
        {/* Numbers */}
        {items.map((val, idx) => {
          const steps = isHours ? (use12Hour ? 12 : 24) : 12; // 12 positions for minutes (0..55)
          const angleDeg = (idx / steps) * 360 - 90;
          const rad = (angleDeg * Math.PI) / 180;
          const x = center + radius * Math.cos(rad);
          const y = center + radius * Math.sin(rad);
          const isSel = selected === val || (!use12Hour && isHours && selected === val);
          // Different look for minutes vs hours: minutes show small text labels
          const basePos = 'absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition';
          const hourBtn = `${basePos} w-10 h-10 rounded-full text-sm font-semibold ${isSel ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : ringColor + ' ' + textColor}`;
          const minuteBtn = isSel
            ? `${basePos} w-12 h-12 rounded-full font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg`
            : `${basePos} w-8 h-8 bg-transparent ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xs`;
          return (
            <button
              type="button"
              key={`${mode}-${val}`}
              onClick={() => {
                if (isHours) {
                  setSelHour(val);
                  setMode('minutes');
                } else {
                  setSelMin(val);
                }
              }}
              className={isHours ? hourBtn : minuteBtn}
              style={{ left: x, top: y }}
            >
              {isHours ? (use12Hour ? val : val.toString().padStart(2, '0')) : val.toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={rootRef} className={`w-full ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${subText}`}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => { setMode('hours'); setOpen((o) => !o); }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${border} ${isDarkMode ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-lg hover:shadow-lg transition-all`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className={`flex items-center gap-3 ${textColor}`}>
          <span className="text-xl">⏰</span>
          <span className="font-mono text-lg font-bold tracking-wider">
            {(() => {
              const display = toDisplay(h, use12Hour);
              return use12Hour 
                ? `${display.hours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` 
                : to24String(h, m);
            })()}
          </span>
          {use12Hour && (
            <span className={`px-2 py-1 rounded-lg text-xs ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-800'}`}>{disp.ampm}</span>
          )}
        </div>
        <span className="opacity-70">▾</span>
      </button>

      {open && (
        <div className={`mt-2 p-4 rounded-2xl border ${border} ${isDarkMode ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-xl shadow-2xl z-50 relative`}> 
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <button type="button" className={`font-mono text-4xl font-bold ${textColor} ${mode==='hours' ? '' : 'opacity-70'}`} onClick={() => setMode('hours')}>
                {use12Hour ? (selHour.toString().padStart(2,'0')) : selHour.toString().padStart(2,'0')}
              </button>
              <span className={`font-mono text-4xl font-bold ${textColor}`}>:</span>
              <button type="button" className={`font-mono text-4xl font-bold ${textColor} ${mode==='minutes' ? '' : 'opacity-70'}`} onClick={() => setMode('minutes')}>
                {selMin.toString().padStart(2,'0')}
              </button>
            </div>
            {use12Hour && (
              <div className="flex flex-col gap-1">
                <button type="button" className={`px-2 py-1 rounded ${selAmpm==='AM' ? 'bg-purple-600 text-white' : ringColor + ' ' + textColor}`} onClick={() => setSelAmpm('AM')}>a.m.</button>
                <button type="button" className={`px-2 py-1 rounded ${selAmpm==='PM' ? 'bg-purple-600 text-white' : ringColor + ' ' + textColor}`} onClick={() => setSelAmpm('PM')}>p.m.</button>
              </div>
            )}
          </div>

          {renderDial()}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" className={`px-3 py-2 rounded-lg ${ringColor} ${textColor} hover:opacity-90`} onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="button" className={`px-3 py-2 rounded-lg ${ringColor} ${textColor} hover:opacity-90`} onClick={() => setMode(mode === 'hours' ? 'minutes' : 'hours')}>
              {mode === 'hours' ? 'Minutos' : 'Horas'}
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95"
              onClick={() => { commit(); setOpen(false); }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClockTimePicker;
