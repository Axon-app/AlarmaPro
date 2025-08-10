import React, { useMemo, useState } from 'react';
import { Alarm, ThemeType } from '../../types';
import { WEEK_DAYS, DEFAULT_ALARM } from '../../constants';
import { validateAlarmForm } from '../../utils';
import { Card, Button, Input } from '../ui';
import { ClockTimePicker, AlarmSounds } from '../common';

interface AlarmFormProps {
  alarm?: Alarm;
  isDarkMode: boolean;
  theme: {
    accent: string;
  };
  themeType: ThemeType;
  onSave: (alarm: Omit<Alarm, 'id'>) => void;
  onCancel: () => void;
  alarmVolume: number;
  onVolumeChange: (volume: number) => void;
  is24HourFormat?: boolean;
}

export const AlarmForm: React.FC<AlarmFormProps> = ({
  alarm,
  isDarkMode,
  theme,
  themeType,
  onSave,
  onCancel,
  alarmVolume,
  onVolumeChange,
  is24HourFormat = true
}) => {
  const accentHex = useMemo(() => {
    switch (theme.accent) {
      case 'purple-600': return '#9333EA';
      case 'blue-600': return '#2563EB';
      case 'orange-600': return '#EA580C';
      case 'green-600': return '#16A34A';
      case 'violet-600': return '#7C3AED';
      default: return '#9333EA';
    }
  }, [theme.accent]);
  const [formData, setFormData] = useState<Omit<Alarm, 'id'>>(
    alarm ? {
      time: alarm.time,
      label: alarm.label,
      days: [...alarm.days],
      sound: alarm.sound,
      enabled: alarm.enabled,
      priority: alarm.priority,
      vibrate: alarm.vibrate,
      gradualWake: alarm.gradualWake,
      challengeMode: alarm.challengeMode
    } : { ...DEFAULT_ALARM }
  );

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAlarmForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors([]);
    onSave(formData);
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: number) => {
    const days = formData.days.includes(day)
      ? formData.days.filter(d => d !== day)
      : [...formData.days, day];
    updateField('days', days);
  };

  return (
    <Card 
      className="max-w-lg mx-auto p-5 sm:p-8"
      isDarkMode={isDarkMode}
    >
      <h3 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'} text-center`}>
        {alarm ? '✏️ Editar Alarma' : '✨ Crear Nueva Alarma'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            {errors.map((error, index) => (
              <p key={index} className="text-red-400 text-sm">{error}</p>
            ))}
          </div>
        )}

        <div>
          <ClockTimePicker
            label="⏰ Hora"
            value={formData.time}
            onChange={(val) => updateField('time', val)}
            isDarkMode={isDarkMode}
            use12Hour={!is24HourFormat}
          />
        </div>

        <Input
          type="text"
          label="🏷️ Etiqueta"
          placeholder="Ej: Reunión importante, Ejercicio, Medicamento..."
          value={formData.label}
          onChange={(e) => updateField('label', e.target.value)}
          className={`${isDarkMode ? 'bg-white/10 text-white border-white/20 placeholder-gray-400' : 'bg-white/70 text-gray-800 border-gray-300 placeholder-gray-500'}`}
        />

        {/* Days of the week */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📅 Días de la semana
          </label>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEK_DAYS.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`flex items-center justify-center h-10 sm:h-11 px-3 rounded-xl text-sm leading-none font-bold transition-all duration-300 ${
                  formData.days.includes(index)
                    ? `bg-gradient-to-r from-${theme.accent} to-purple-600 text-white shadow-xl`
                    : isDarkMode
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                      : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-1">
            <AlarmSounds
              selectedSound={typeof formData.sound === 'string' ? formData.sound : ''}
              onSoundChange={(url) => updateField('sound', url)}
              className=""
            />
          </div>

          <div className="sm:col-span-1">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              🔊 Volumen
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={alarmVolume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className={`w-full h-3 rounded-full appearance-none cursor-pointer outline-none`}
              style={{
                background: `linear-gradient(to right, ${accentHex} ${alarmVolume}%, ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'} ${alarmVolume}%)`,
                accentColor: accentHex as any,
                color: accentHex
              }}
            />
          </div>
        </div>

        {/* Advanced options */}
  <div className="space-y-3">
          <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            ⚙️ Opciones Avanzadas
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { key: 'vibrate', label: '📳 Vibrar' },
              { key: 'gradualWake', label: '🌅 Despertar Gradual' },
              { key: 'challengeMode', label: '🧩 Modo Desafío' }
            ].map((option) => (
              <label key={option.key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[option.key as keyof typeof formData] as boolean}
                  onChange={(e) => updateField(option.key as keyof typeof formData, e.target.checked as any)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

    <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
          <Button
            type="submit"
            variant="primary"
      className="flex-1 py-3 sm:py-4 text-base sm:text-lg"
            isDarkMode={isDarkMode}
            themeType={themeType}
          >
            {alarm ? '✅ Actualizar' : '💾 Guardar'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
      className="flex-1 py-3 sm:py-4 text-base sm:text-lg"
            isDarkMode={isDarkMode}
            themeType={themeType}
          >
            ❌ Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};
