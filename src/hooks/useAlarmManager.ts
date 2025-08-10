import { useState, useEffect, useCallback } from 'react';
import { Alarm } from '../types';
import { shouldTriggerAlarm } from '../utils';

interface UseAlarmManagerReturn {
  alarms: Alarm[];
  activeAlarm: Alarm | null;
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  updateAlarm: (id: number, alarm: Omit<Alarm, 'id'>) => void;
  deleteAlarm: (id: number) => void;
  toggleAlarm: (id: number) => void;
  dismissAlarm: () => void;
  triggerAlarm: (alarm: Alarm) => void;
}

export const useAlarmManager = (): UseAlarmManagerReturn => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);

  // Load alarms from localStorage on mount
  useEffect(() => {
    const savedAlarms = localStorage.getItem('alarmaPro_alarms');
    if (savedAlarms) {
      try {
        setAlarms(JSON.parse(savedAlarms));
      } catch (error) {
        console.error('Error loading alarms from localStorage:', error);
      }
    }
  }, []);

  // Save alarms to localStorage whenever alarms change
  useEffect(() => {
    localStorage.setItem('alarmaPro_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Check for triggered alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      alarms.forEach(alarm => {
        if (shouldTriggerAlarm(alarm, now) && !activeAlarm) {
          triggerAlarm(alarm);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, activeAlarm]);

  const addAlarm = useCallback((alarmData: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now()
    };
    setAlarms(prev => [...prev, newAlarm]);
  }, []);

  const updateAlarm = useCallback((id: number, alarmData: Omit<Alarm, 'id'>) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarmData, id } : alarm
      )
    );
  }, []);

  const deleteAlarm = useCallback((id: number) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: number) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  }, []);

  const triggerAlarm = useCallback((alarm: Alarm) => {
    setActiveAlarm(alarm);
  }, []);

  const dismissAlarm = useCallback(() => {
    setActiveAlarm(null);
  }, []);

  return {
    alarms,
    activeAlarm,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    dismissAlarm,
    triggerAlarm
  };
};
