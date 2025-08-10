import { useState, useEffect } from 'react';
import { AppSettings, ThemeType } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  isDarkMode: true,
  is24HourFormat: true,
  theme: 'purple',
  voiceEnabled: false,
  animationStyle: 'smooth',
  alarmVolume: 80
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('alarmaPro_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('alarmaPro_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleDarkMode = () => {
    updateSetting('isDarkMode', !settings.isDarkMode);
  };

  const toggleTimeFormat = () => {
    updateSetting('is24HourFormat', !settings.is24HourFormat);
  };

  const toggleVoice = () => {
    updateSetting('voiceEnabled', !settings.voiceEnabled);
  };

  const setTheme = (theme: ThemeType) => {
    updateSetting('theme', theme);
  };

  const setVolume = (volume: number) => {
    updateSetting('alarmVolume', Math.max(0, Math.min(100, volume)));
  };

  return {
    settings,
    updateSetting,
    toggleDarkMode,
    toggleTimeFormat,
    toggleVoice,
    setTheme,
    setVolume
  };
};
