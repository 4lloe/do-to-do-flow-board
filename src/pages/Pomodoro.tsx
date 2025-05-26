
import React from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';

const Pomodoro: React.FC = () => {
  return (
    <AppLayout>
      <Header title="Pomodoro Timer" />
      <div className="p-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pomodoro Timer</h2>
          <p className="text-gray-400">Your Pomodoro timer will be here.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Pomodoro;
