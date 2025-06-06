
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dashboard, List, Timer, Clock, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-[200px] h-screen bg-sidebar fixed left-0 top-0 p-4 flex flex-col">
      <div className="flex items-center mb-8 mt-2">
        <div className="h-6 w-6 bg-primary rounded mr-2"></div>
        <h1 className="text-lg font-bold text-white">Do-to-do</h1>
      </div>
      
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md transition-colors ${
              isActive ? 'bg-secondary text-white' : 'text-gray-400 hover:bg-secondary/50'
            }`
          }
        >
          <Dashboard className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/tasks" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md transition-colors ${
              isActive ? 'bg-secondary text-white' : 'text-gray-400 hover:bg-secondary/50'
            }`
          }
        >
          <List className="w-5 h-5 mr-3" />
          <span>Tasks</span>
        </NavLink>
        
        <NavLink 
          to="/pomodoro" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md transition-colors ${
              isActive ? 'bg-secondary text-white' : 'text-gray-400 hover:bg-secondary/50'
            }`
          }
        >
          <Timer className="w-5 h-5 mr-3" />
          <span>Pomodoro</span>
        </NavLink>
        
        <NavLink 
          to="/time-blocking" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md transition-colors ${
              isActive ? 'bg-secondary text-white' : 'text-gray-400 hover:bg-secondary/50'
            }`
          }
        >
          <Clock className="w-5 h-5 mr-3" />
          <span>Time blocking</span>
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-md transition-colors ${
              isActive ? 'bg-secondary text-white' : 'text-gray-400 hover:bg-secondary/50'
            }`
          }
        >
          <Settings className="w-5 h-5 mr-3" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
