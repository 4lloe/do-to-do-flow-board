
import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { usePomodoro } from '../contexts/PomodoroContext';
import { useToast } from '../hooks/use-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = usePomodoro();
  const { toast } = useToast();
  
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  
  const [workInterval, setWorkInterval] = useState(Math.floor(settings.workInterval / 60).toString());
  const [breakInterval, setBreakInterval] = useState(Math.floor(settings.breakInterval / 60).toString());
  const [intervalsUntilLongBreak, setIntervalsUntilLongBreak] = useState(settings.intervalsUntilLongBreak.toString());
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate pomodoro settings
    const workMinutes = parseInt(workInterval);
    const breakMinutes = parseInt(breakInterval);
    const intervals = parseInt(intervalsUntilLongBreak);
    
    if (isNaN(workMinutes) || workMinutes <= 0 ||
        isNaN(breakMinutes) || breakMinutes <= 0 ||
        isNaN(intervals) || intervals <= 0) {
      toast({
        title: "Invalid settings",
        description: "All values must be positive numbers",
        variant: "destructive",
      });
      return;
    }
    
    // Update pomodoro settings
    updateSettings({
      workInterval: workMinutes * 60,
      breakInterval: breakMinutes * 60,
      intervalsUntilLongBreak: intervals
    });
    
    toast({
      title: "Settings saved",
      description: "Your settings have been updated.",
    });
  };

  return (
    <AppLayout>
      <Header title="Settings" />
      
      <div className="p-6">
        <form onSubmit={handleSaveSettings} className="max-w-md">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled // Email can't be changed in this example
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="border-t border-gray-700 pt-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">Pomodoro Settings</h2>
            
            <div className="mb-4">
              <label htmlFor="workInterval" className="block text-sm font-medium mb-1">
                Work interval (min.):
              </label>
              <input
                id="workInterval"
                type="number"
                value={workInterval}
                onChange={(e) => setWorkInterval(e.target.value)}
                className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="breakInterval" className="block text-sm font-medium mb-1">
                Break interval (min.):
              </label>
              <input
                id="breakInterval"
                type="number"
                value={breakInterval}
                onChange={(e) => setBreakInterval(e.target.value)}
                className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="intervals" className="block text-sm font-medium mb-1">
                Intervals count (max 10):
              </label>
              <input
                id="intervals"
                type="number"
                value={intervalsUntilLongBreak}
                onChange={(e) => setIntervalsUntilLongBreak(e.target.value)}
                className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                max="10"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            Save
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Settings;
