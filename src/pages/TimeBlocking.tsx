
import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import { useTimeBlocks, TimeBlock } from '../contexts/TimeBlockContext';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TimeBlocking: React.FC = () => {
  const { timeBlocks, addTimeBlock, updateTimeBlock, deleteTimeBlock, getTotalTime } = useTimeBlocks();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [color, setColor] = useState('#3B82F6');
  
  const availableColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F97316', // Orange
  ];

  const handleAddTimeBlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !duration.trim()) {
      toast({
        title: "Error",
        description: "Name and duration are required",
        variant: "destructive",
      });
      return;
    }
    
    const durationMinutes = parseInt(duration);
    
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      toast({
        title: "Error",
        description: "Duration must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    addTimeBlock({
      name: name.trim(),
      duration: durationMinutes,
      color,
    });
    
    setName('');
    setDuration('');
    toast({
      title: "Time block added",
      description: `${name} (${durationMinutes} min) has been added to your schedule.`,
    });
  };

  const handleDeleteTimeBlock = (id: string) => {
    deleteTimeBlock(id);
    toast({
      title: "Time block deleted",
      variant: "destructive",
    });
  };

  const totalTime = getTotalTime();
  const restTime = 24 * 60 - totalTime;
  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = totalTime % 60;
  
  return (
    <AppLayout>
      <Header title="Time blocking" />
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {timeBlocks.map(block => (
            <div 
              key={block.id}
              className="time-block"
              style={{ backgroundColor: block.color }}
            >
              <div>
                <div className="font-medium">{block.name}</div>
                <div className="text-sm opacity-80">{block.duration} min.</div>
              </div>
              <button
                onClick={() => handleDeleteTimeBlock(block.id)}
                className="p-1 rounded hover:bg-black/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          <div className="mt-4 text-sm text-gray-400">
            {totalHours} hours out of 24 left for sleep
          </div>
        </div>
        
        <div>
          <form onSubmit={handleAddTimeBlock} className="bg-card p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Enter name:
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter name"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium mb-1">
                Enter duration (min.):
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 rounded bg-secondary text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter duration"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Color:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 flex items-center justify-center gap-2 w-full"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default TimeBlocking;
