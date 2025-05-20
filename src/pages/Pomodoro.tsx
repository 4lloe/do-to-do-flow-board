
import React from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import { usePomodoro } from '../contexts/PomodoroContext';
import { Play, Pause, SkipForward } from 'lucide-react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Pomodoro: React.FC = () => {
  const { 
    timeRemaining, 
    isRunning, 
    isBreak, 
    currentInterval,
    settings,
    startTimer, 
    pauseTimer, 
    skipToNextInterval 
  } = usePomodoro();

  return (
    <AppLayout>
      <Header title="Pomodoro timer" />
      
      <div className="flex flex-col items-center justify-center p-12">
        <div className="text-7xl font-mono font-bold mb-6">
          {formatTime(timeRemaining)}
        </div>
        
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: settings.intervalsUntilLongBreak }).map((_, index) => (
            <div 
              key={index}
              className={`h-1 w-5 rounded ${
                index + 1 === currentInterval ? 'bg-primary' : 'bg-gray-700'
              }`}
            ></div>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="p-3 rounded-full bg-primary hover:bg-primary/80 text-white"
            >
              <Play className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="p-3 rounded-full bg-primary hover:bg-primary/80 text-white"
            >
              <Pause className="h-6 w-6" />
            </button>
          )}
          
          <button
            onClick={skipToNextInterval}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 text-white"
          >
            <SkipForward className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-8 text-xl font-medium">
          {isBreak 
            ? (currentInterval >= settings.intervalsUntilLongBreak 
              ? 'Long Break' 
              : 'Short Break')
            : 'Focus Time'
          }
        </div>
      </div>
    </AppLayout>
  );
};

export default Pomodoro;
