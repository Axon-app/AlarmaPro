import { Alarm, AlarmPriority } from '../types';

/**
 * Formats time string for display based on 24-hour format preference
 */
export const formatTime = (date: Date, is24HourFormat: boolean): string => {
  if (is24HourFormat) {
    return date.toLocaleTimeString('es-ES', { 
      hour12: false,
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  } else {
    return date.toLocaleTimeString('es-ES', { 
      hour12: true,
      hour: 'numeric', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }
};

/**
 * Formats alarm time string for display
 */
export const formatAlarmTime = (timeString: string, is24HourFormat: boolean): string => {
  if (is24HourFormat) {
    return timeString;
  } else {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
};

/**
 * Formats date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Gets priority color classes based on alarm priority
 */
export const getPriorityColor = (priority: AlarmPriority, isDarkMode: boolean): string => {
  const darkColors = {
    low: 'from-blue-600 to-cyan-600',
    normal: 'from-green-600 to-emerald-600',
    high: 'from-yellow-600 to-orange-600',
    urgent: 'from-red-600 to-pink-600'
  };
  
  const lightColors = {
    low: 'from-blue-400 to-cyan-400',
    normal: 'from-green-400 to-emerald-400',
    high: 'from-yellow-400 to-orange-400',
    urgent: 'from-red-400 to-pink-400'
  };
  
  return isDarkMode ? darkColors[priority] : lightColors[priority];
};

/**
 * Gets priority label with emoji
 */
export const getPriorityLabel = (priority: AlarmPriority): string => {
  const labels = {
    low: '🔵 BAJA',
    normal: '🟢 NORMAL',
    high: '🟡 ALTA',
    urgent: '🔴 URGENTE'
  };
  
  return labels[priority];
};

/**
 * Checks if an alarm should trigger at the current time
 */
export const shouldTriggerAlarm = (alarm: Alarm, currentTime: Date): boolean => {
  if (!alarm.enabled) return false;
  
  const currentTimeStr = currentTime.toTimeString().slice(0, 5);
  const currentDay = currentTime.getDay();
  
  if (alarm.time !== currentTimeStr) return false;
  
  // If no specific days are set, alarm triggers every day
  if (alarm.days.length === 0) return true;
  
  // Check if current day is in alarm's scheduled days
  return alarm.days.includes(currentDay);
};

/**
 * Creates a quick alarm for the specified minutes from now
 */
export const createQuickAlarm = (minutes: number): Omit<Alarm, 'id'> => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  const timeStr = now.toTimeString().slice(0, 5);
  
  return {
    time: timeStr,
    label: `Alarma rápida ${minutes} min`,
    days: [],
    sound: 'gentle',
    enabled: true,
    priority: 'high',
    vibrate: true,
  gradualWake: false,
  useVoice: false
  };
};

/**
 * Creates a snooze alarm based on the active alarm
 */
export const createSnoozeAlarm = (
  activeAlarm: Alarm, 
  snoozeCount: number, 
  snoozeDuration: number = 5
): Omit<Alarm, 'id'> => {
  const snoozeTime = new Date();
  snoozeTime.setMinutes(snoozeTime.getMinutes() + snoozeDuration);
  const timeStr = snoozeTime.toTimeString().slice(0, 5);
  
  return {
    ...activeAlarm,
    time: timeStr,
    label: `${activeAlarm.label} (Snooze ${snoozeCount + 1})`,
  days: [],
  useVoice: (activeAlarm as any).useVoice ?? false
  };
};

/**
 * Generates a random math challenge for challenge mode
 */
export const generateMathChallenge = (): { question: string; answer: number } => {
  const num1 = Math.floor(Math.random() * 20) + 5;
  const num2 = Math.floor(Math.random() * 20) + 5;
  
  return {
    question: `¿Cuánto es ${num1} + ${num2}?`,
    answer: num1 + num2
  };
};

/**
 * Validates alarm form data
 */
export const validateAlarmForm = (alarm: Omit<Alarm, 'id'>): string[] => {
  const errors: string[] = [];
  
  if (!alarm.time) {
    errors.push('La hora es requerida');
  }
  
  if (!alarm.label.trim()) {
    errors.push('La etiqueta es requerida');
  }
  
  if (alarm.label.length > 50) {
    errors.push('La etiqueta no puede exceder 50 caracteres');
  }
  
  return errors;
};
