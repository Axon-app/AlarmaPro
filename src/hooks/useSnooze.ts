import { useState, useCallback } from 'react';

interface UseSnoozeReturn {
  isSnoozing: boolean;
  snoozeCount: number;
  canSnooze: boolean;
  snooze: () => void;
  resetSnooze: () => void;
}

export const useSnooze = (maxSnoozeCount: number = 3): UseSnoozeReturn => {
  const [isSnoozing, setIsSnoozing] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);

  const canSnooze = snoozeCount < maxSnoozeCount;

  const snooze = useCallback(() => {
    if (canSnooze) {
      setSnoozeCount(prev => prev + 1);
      setIsSnoozing(true);
      
      // Hide snooze notification after 2 seconds
      setTimeout(() => {
        setIsSnoozing(false);
      }, 2000);
    }
  }, [canSnooze]);

  const resetSnooze = useCallback(() => {
    setSnoozeCount(0);
    setIsSnoozing(false);
  }, []);

  return {
    isSnoozing,
    snoozeCount,
    canSnooze,
    snooze,
    resetSnooze
  };
};
