
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface TimeBlock {
  id: string;
  name: string;
  duration: number;
  color: string;
  userId: string;
}

interface TimeBlockContextType {
  timeBlocks: TimeBlock[];
  addTimeBlock: (block: Omit<TimeBlock, 'id' | 'userId'>) => void;
  updateTimeBlock: (id: string, block: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  getTotalTime: () => number;
}

const TimeBlockContext = createContext<TimeBlockContextType | undefined>(undefined);

export const useTimeBlocks = () => {
  const context = useContext(TimeBlockContext);
  if (!context) {
    throw new Error('useTimeBlocks must be used within a TimeBlockProvider');
  }
  return context;
};

export const TimeBlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);

  // Load time blocks from localStorage
  useEffect(() => {
    if (user) {
      const storedBlocks = localStorage.getItem(`timeBlocks_${user.id}`);
      if (storedBlocks) {
        setTimeBlocks(JSON.parse(storedBlocks));
      } else {
        // Default time blocks for new users
        const defaultBlocks: Omit<TimeBlock, 'id' | 'userId'>[] = [
          { name: 'Morning routine', duration: 60, color: '#3B82F6' },
          { name: 'Lunch break', duration: 60, color: '#10B981' },
          { name: 'Workout', duration: 60, color: '#F59E0B' },
          { name: 'Work', duration: 480, color: '#3B82F6' },
          { name: 'Evening time', duration: 120, color: '#F97316' }
        ];
        
        const blocksWithIds = defaultBlocks.map(block => ({
          ...block,
          id: Date.now().toString() + Math.random().toString(36).substring(2),
          userId: user.id
        }));
        
        setTimeBlocks(blocksWithIds);
        localStorage.setItem(`timeBlocks_${user.id}`, JSON.stringify(blocksWithIds));
      }
    } else {
      setTimeBlocks([]);
    }
  }, [user]);

  // Save time blocks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`timeBlocks_${user.id}`, JSON.stringify(timeBlocks));
    }
  }, [timeBlocks, user]);

  const addTimeBlock = (block: Omit<TimeBlock, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newBlock: TimeBlock = {
      ...block,
      id: Date.now().toString(),
      userId: user.id
    };
    
    setTimeBlocks(prev => [...prev, newBlock]);
  };

  const updateTimeBlock = (id: string, updatedBlock: Partial<TimeBlock>) => {
    setTimeBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, ...updatedBlock } : block
      )
    );
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks(prev => prev.filter(block => block.id !== id));
  };

  const getTotalTime = (): number => {
    return timeBlocks.reduce((total, block) => total + block.duration, 0);
  };

  return (
    <TimeBlockContext.Provider value={{
      timeBlocks,
      addTimeBlock,
      updateTimeBlock,
      deleteTimeBlock,
      getTotalTime
    }}>
      {children}
    </TimeBlockContext.Provider>
  );
};
