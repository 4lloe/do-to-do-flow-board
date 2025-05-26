
import React from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';

const Tasks: React.FC = () => {
  return (
    <AppLayout>
      <Header title="Tasks" />
      <div className="p-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Task Management</h2>
          <p className="text-gray-400">Your task management system will be here.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Tasks;
