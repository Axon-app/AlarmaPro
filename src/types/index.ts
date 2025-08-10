export interface Alarm {
  id: number;
  time: string;
  label: string;
  days: number[];
  sound: string; // Changed to string instead of keyof
  enabled: boolean;
  priority: AlarmPriority;
  vibrate: boolean;
  gradualWake: boolean;
  challengeMode: boolean;
}

export type AlarmPriority = 'low' | 'normal' | 'high' | 'urgent';

export type ThemeType = 'purple' | 'ocean' | 'sunset' | 'forest' | 'cosmic';

export type AnimationStyle = 'smooth' | 'bouncy' | 'fast';

export interface Theme {
  from: string;
  to: string;
  accent: string;
  light: string;
}

export interface AlarmSound {
  name: string;
  description: string;
}

export interface QuickAlarm {
  minutes: number;
  label: string;
  icon: string; // Changed from any to string for emoji icons
}

export interface AppSettings {
  isDarkMode: boolean;
  is24HourFormat: boolean;
  theme: ThemeType;
  voiceEnabled: boolean;
  animationStyle: AnimationStyle;
  alarmVolume: number;
}

export enum AlarmSounds {
  gentle = 'gentle',
  energetic = 'energetic',
  nature = 'nature',
  classic = 'classic',
  binaural = 'binaural',
  piano = 'piano',
  cosmic = 'cosmic'
}
