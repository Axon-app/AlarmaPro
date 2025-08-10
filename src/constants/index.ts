// import { Coffee, Timer, Activity, Target, Clock, Music, Bell, Sparkles } from 'lucide-react';
import { AlarmSound, QuickAlarm, Theme, ThemeType } from '../types';

export const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const THEMES: Record<ThemeType, Theme> = {
  purple: { 
    from: 'from-purple-900', 
    to: 'to-indigo-900', 
    accent: 'purple-600', 
    light: 'from-purple-50 to-indigo-50' 
  },
  ocean: { 
    from: 'from-blue-900', 
    to: 'to-cyan-900', 
    accent: 'blue-600', 
    light: 'from-blue-50 to-cyan-50' 
  },
  sunset: { 
    from: 'from-orange-900', 
    to: 'to-red-900', 
    accent: 'orange-600', 
    light: 'from-orange-50 to-red-50' 
  },
  forest: { 
    from: 'from-green-900', 
    to: 'to-emerald-900', 
    accent: 'green-600', 
    light: 'from-green-50 to-emerald-50' 
  },
  cosmic: { 
    from: 'from-violet-900', 
    to: 'to-pink-900', 
    accent: 'violet-600', 
    light: 'from-violet-50 to-pink-50' 
  }
};

// Emoji/icon for each theme to show in selectors and UI
export const THEME_EMOJI: Record<ThemeType, string> = {
  purple: '🟣',
  ocean: '🌊',
  sunset: '🌅',
  forest: '🌲',
  cosmic: '🌌',
};

// Hex accent per theme for inline gradients and effects
export const THEME_ACCENT_HEX: Record<ThemeType, string> = {
  purple: '#9333ea', // purple-600
  ocean: '#2563eb',  // blue-600
  sunset: '#ea580c', // orange-600
  forest: '#16a34a', // green-600
  cosmic: '#7c3aed', // violet-600
};

// Wave visual styles per theme for the clock visualizer
export type WaveVariant = 'ribbons' | 'bars' | 'dots' | 'bezier';
export const THEME_WAVES: Record<ThemeType, { variant: WaveVariant; colors: string[] } > = {
  purple: {
    variant: 'ribbons',
    colors: ['#a78bfa', '#f0abfc', '#c4b5fd', '#f5d0fe']
  },
  ocean: {
    variant: 'bezier',
    colors: ['#38bdf8', '#22d3ee', '#60a5fa', '#06b6d4']
  },
  sunset: {
    variant: 'bars',
    colors: ['#fb7185', '#f97316', '#f59e0b', '#ef4444']
  },
  forest: {
    variant: 'dots',
    colors: ['#34d399', '#86efac', '#22c55e', '#a3e635']
  },
  cosmic: {
    variant: 'ribbons',
    colors: ['#a78bfa', '#f472b6', '#60a5fa', '#c084fc']
  }
};

export const ALARM_SOUNDS: Record<string, AlarmSound> = {
  gentle: { name: '🎵 Suave Despertar', description: 'Melodía relajante' },
  energetic: { name: '⚡ Power Up', description: 'Energía máxima' },
  nature: { name: '🌊 Sonidos Naturales', description: 'Aves y agua' },
  classic: { name: '⏰ Clásico Digital', description: 'Beep tradicional' },
  binaural: { name: '🧠 Binaural', description: 'Frecuencias cerebrales' },
  piano: { name: '🎹 Piano Suave', description: 'Notas de piano' },
  cosmic: { name: '🌌 Cósmico', description: 'Sonidos del espacio' }
};

export const QUICK_ALARMS: QuickAlarm[] = [
  { minutes: 5, label: '5 min', icon: '☕' },
  { minutes: 10, label: '10 min', icon: '⏱️' },
  { minutes: 15, label: '15 min', icon: '☕' },
  { minutes: 20, label: '20 min', icon: '🏃' },
  { minutes: 30, label: '30 min', icon: '🎯' },
  { minutes: 60, label: '1 hora', icon: '⏰' }
];

export const DEFAULT_ALARM = {
  time: '',
  label: '',
  days: [],
  sound: 'gentle' as keyof typeof ALARM_SOUNDS,
  enabled: true,
  priority: 'normal' as const,
  vibrate: true,
  gradualWake: false,
  challengeMode: false
};

export const SNOOZE_DURATION = 5; // minutes
export const MAX_SNOOZE_COUNT = 3;
export const ANIMATION_DURATION = 300;
export const WAVE_COUNT = 5;
