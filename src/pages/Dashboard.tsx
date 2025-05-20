
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import { useTasks } from '../contexts/TaskContext';

const Dashboard: React.FC = () => {
  const { tasks } = useTasks();
  const navigate = useNavigate();
  
  const completedTasks = tasks.filter(task => task.completed);
  const todayTasks = tasks.filter(task => task.category === 'today');
  const weekTasks = tasks.filter(task => task.category === 'this-week' || task.category === 'next-week');

  const StatCard = ({ 
    title, 
    count, 
    onClick 
  }: { 
    title: string; 
    count: number;
    onClick?: () => void;
  }) => (
    <div 
      className="bg-card p-6 rounded-lg shadow-md cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-base text-gray-400 mb-2">{title}</h2>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );

  return (
    <AppLayout>
      <Header title="Statistics" />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total" 
            count={tasks.length}
            onClick={() => navigate('/tasks')} 
          />
          <StatCard 
            title="Completed tasks" 
            count={completedTasks.length}
            onClick={() => navigate('/tasks')} 
          />
          <StatCard 
            title="Today tasks" 
            count={todayTasks.length}
            onClick={() => navigate('/tasks')} 
          />
          <StatCard 
            title="Week tasks" 
            count={weekTasks.length}
            onClick={() => navigate('/tasks')} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
