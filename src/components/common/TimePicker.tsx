import React, { useEffect, useMemo, useRef, useState } from 'react';

interface TimePickerProps {
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
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || '');
  let h = 8, m = 0;
  if (match) {
    h = clamp(parseInt(match[1], 10), 0, 23);
    m = clamp(parseInt(match[2], 10), 0, 59);
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

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  isDarkMode,
  use12Hour = false,
  className = '',
  label = '⏰ Hora',
}) => {
  const { h, m } = useMemo(() => parse24(value), [value]);
  const disp = useMemo(() => toDisplay(h, use12Hour), [h, use12Hour]);
  const [open, setOpen] = useState(false);
  const [selHour, setSelHour] = useState(disp.hours);
  const [selMin, setSelMin] = useState(m);
  const [selAmpm, setSelAmpm] = useState<'AM' | 'PM' | ''>(disp.ampm);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // keep internal state in sync when external value changes
    const d = toDisplay(h, use12Hour);
    setSelHour(d.hours);
    setSelMin(m);
    setSelAmpm(d.ampm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, use12Hour]);

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

  const hoursList = useMemo(() => {
    return use12Hour ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
  }, [use12Hour]);
  const minutesList = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const chipBg = isDarkMode ? 'bg-white/10' : 'bg-black/10';
  const chipTxt = isDarkMode ? 'text-white' : 'text-gray-800';
  const cardBg = isDarkMode ? 'bg-white/10' : 'bg-white/80';
  const border = isDarkMode ? 'border-white/20' : 'border-gray-200';

  return (
    <div ref={rootRef} className={`w-full ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${border} ${cardBg} backdrop-blur-lg hover:shadow-lg transition-all`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className={`flex items-center gap-3 ${chipTxt}`}>
          <span className="text-xl">⏰</span>
          <span className="font-mono text-lg font-bold tracking-wider">
            {to24String(h, m)}
          </span>
          {use12Hour && (
            <span className={`px-2 py-1 rounded-lg text-xs ${chipBg} ${chipTxt}`}>{disp.ampm}</span>
          )}
        </div>
        <span className="opacity-70">▾</span>
      </button>

      {open && (
        <div className={`mt-2 p-3 rounded-2xl border ${border} ${cardBg} backdrop-blur-xl shadow-2xl z-50 relative`}> 
          <div className="grid" style={{ gridTemplateColumns: use12Hour ? '1fr 1fr 0.7fr' : '1fr 1fr' }}>
            {/* Hours */}
            <div className="px-2">
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hora</div>
              <div className="h-40 overflow-y-auto snap-y snap-mandatory pr-1">
                {hoursList.map((hh) => {
                  const selected = hh === selHour;
                  return (
                    <button
                      type="button"
                      key={hh}
                      onClick={() => { setSelHour(hh); commit(hh, selMin, selAmpm); }}
                      className={`w-full h-10 flex items-center justify-center rounded-xl mb-1 snap-start transition-all 
                        ${selected ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : chipBg + ' ' + chipTxt + ' hover:scale-[1.02]'}
                      `}
                    >
                      <span className="font-mono font-semibold">{use12Hour ? hh.toString().padStart(2, '0') : hh.toString().padStart(2, '0')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Minutes */}
            <div className="px-2">
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minutos</div>
              <div className="h-40 overflow-y-auto snap-y snap-mandatory pr-1">
                {minutesList.map((mm) => {
                  const selected = mm === selMin;
                  return (
                    <button
                      type="button"
                      key={mm}
                      onClick={() => { setSelMin(mm); commit(selHour, mm, selAmpm); }}
                      className={`w-full h-10 flex items-center justify-center rounded-xl mb-1 snap-start transition-all 
                        ${selected ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : chipBg + ' ' + chipTxt + ' hover:scale-[1.02]'}
                      `}
                    >
                      <span className="font-mono font-semibold">{mm.toString().padStart(2, '0')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* AM/PM */}
            {use12Hour && (
              <div className="px-2">
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Periodo</div>
                <div className="h-40 overflow-y-auto snap-y snap-mandatory pr-1">
                  {(['AM','PM'] as const).map((ap) => {
                    const selected = ap === selAmpm;
                    return (
                      <button
                        type="button"
                        key={ap}
                        onClick={() => { setSelAmpm(ap); commit(selHour, selMin, ap); }}
                        className={`w-full h-10 flex items-center justify-center rounded-xl mb-1 snap-start transition-all 
                          ${selected ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : chipBg + ' ' + chipTxt + ' hover:scale-[1.02]'}
                        `}
                      >
                        <span className="font-semibold">{ap}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick controls */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-2 rounded-lg ${chipBg} ${chipTxt} hover:opacity-90`}
                onClick={() => { const now = new Date(); const nv = to24String(now.getHours(), now.getMinutes()); onChange(nv); }}
              >
                Ahora
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-lg ${chipBg} ${chipTxt} hover:opacity-90`}
                onClick={() => { setOpen(false); }}
              >
                Listo
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="-1 min"
                className={`w-10 h-10 rounded-lg ${chipBg} ${chipTxt} hover:opacity-90`}
                onClick={() => {
                  let next = selMin - 1; if (next < 0) next = 59;
                  setSelMin(next); commit(selHour, next, selAmpm);
                }}
              >−</button>
              <button
                type="button"
                aria-label="+1 min"
                className={`w-10 h-10 rounded-lg ${chipBg} ${chipTxt} hover:opacity-90`}
                onClick={() => {
                  let next = selMin + 1; if (next > 59) next = 0;
                  setSelMin(next); commit(selHour, next, selAmpm);
                }}
              >+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
