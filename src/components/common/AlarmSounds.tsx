import React, { useMemo, useRef, useState } from 'react';
import { ALARM_SOUNDS } from '../../constants/alarmSounds.ts';
import type { AlarmSound } from '../../constants/alarmSounds.ts';
import { addCustomSound, getCustomSounds, type CustomSound } from '../../utils/customSounds';

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
  const fileRef = useRef<HTMLInputElement>(null);
  const [customList, setCustomList] = useState<CustomSound[]>(() => getCustomSounds());

  const allOptions = useMemo(() => {
    // map custom sounds to AlarmSound-like objects
    const mapped: AlarmSound[] = customList.map((c) => ({ name: c.name, url: c.dataUrl, icon: '📁' }));
    return [...ALARM_SOUNDS, ...mapped];
  }, [customList]);

  const pickFile = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.replace(/\.[^.]+$/, '');
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const saved = addCustomSound(name, dataUrl);
    const next = getCustomSounds();
    setCustomList(next);
    onSoundChange(saved.dataUrl);
    e.target.value = '';
  };

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const val = e.target.value;
    if (val === '__pick__') {
      // open native picker and keep current selection
      setTimeout(() => pickFile(), 0);
      return;
    }
    onSoundChange(val);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Sonido de Alarma
      </label>
      <div className="flex items-center gap-2">
        <select
          value={selectedSound || allOptions[0]?.url}
          onChange={handleChange}
          className="flex-1 p-3 rounded-xl bg-white/10 text-gray-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {allOptions.map((s: AlarmSound) => (
            <option key={s.url} value={s.url}>{`${s.icon} ${s.name}`}</option>
          ))}
          <option value="__pick__">📲 Elegir desde dispositivo…</option>
        </select>
  <input ref={fileRef} type="file" accept="audio/*" hidden onChange={onFile} />
      </div>
    </div>
  );
};
