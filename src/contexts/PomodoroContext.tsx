
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface PomodoroSettings {
  workInterval: number;
  breakInterval: number;
  intervalsUntilLongBreak: number;
}

interface PomodoroContextType {
  settings: PomodoroSettings;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
  timeRemaining: number;
  isRunning: boolean;
  isBreak: boolean;
  currentInterval: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNextInterval: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PomodoroSettings>({
    workInterval: 25 * 60, // 25 minutes
    breakInterval: 5 * 60, // 5 minutes
    intervalsUntilLongBreak: 4
  });
  
  const [timeRemaining, setTimeRemaining] = useState(settings.workInterval);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [timerId, setTimerId] = useState<number | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    if (user) {
      const storedSettings = localStorage.getItem(`pomodoro_${user.id}`);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        if (!isRunning) {
          setTimeRemaining(isBreak ? parsedSettings.breakInterval : parsedSettings.workInterval);
        }
      }
    }
  }, [user]);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`pomodoro_${user.id}`, JSON.stringify(settings));
    }
  }, [settings, user]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      const id = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up
            clearInterval(id);
            
            // Play sound
            const audio = new Audio('/timer-end.mp3');
            audio.play().catch(err => console.error('Failed to play sound:', err));
            
            // Toggle between work and break
            if (isBreak) {
              // After break, start work again
              setIsBreak(false);
              
              // Increment interval counter if needed
              if (currentInterval >= settings.intervalsUntilLongBreak) {
                setCurrentInterval(1);
              } else {
                setCurrentInterval(prev => prev + 1);
              }
              
              return settings.workInterval;
            } else {
              // After work, start break
              setIsBreak(true);
              
              // If we've completed all intervals, take a longer break
              if (currentInterval >= settings.intervalsUntilLongBreak) {
                return settings.breakInterval * 3; // Triple break time for long break
              }
              return settings.breakInterval;
            }
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerId(id);
      
      return () => {
        if (id) clearInterval(id);
      };
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, isBreak, currentInterval, settings]);

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // If timer isn't running, update the current time remaining based on work/break state
      if (!isRunning) {
        setTimeRemaining(isBreak ? updated.breakInterval : updated.workInterval);
      }
      
      return updated;
    });
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (timerId) clearInterval(timerId);
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeRemaining(isBreak ? settings.breakInterval : settings.workInterval);
  };

  const skipToNextInterval = () => {
    pauseTimer();
    
    if (isBreak) {
      setIsBreak(false);
      setTimeRemaining(settings.workInterval);
      
      if (currentInterval >= settings.intervalsUntilLongBreak) {
        setCurrentInterval(1);
      } else {
        setCurrentInterval(prev => prev + 1);
      }
    } else {
      setIsBreak(true);
      setTimeRemaining(currentInterval >= settings.intervalsUntilLongBreak 
        ? settings.breakInterval * 3 
        : settings.breakInterval);
    }
  };

  return (
    <PomodoroContext.Provider value={{
      settings,
      updateSettings,
      timeRemaining,
      isRunning,
      isBreak,
      currentInterval,
      startTimer,
      pauseTimer,
      resetTimer,
      skipToNextInterval
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};
