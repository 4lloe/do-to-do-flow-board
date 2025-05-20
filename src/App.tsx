
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import { TimeBlockProvider } from './contexts/TimeBlockContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Pomodoro from './pages/Pomodoro';
import TimeBlocking from './pages/TimeBlocking';
import Settings from './pages/Settings';

const App = () => (
  <AuthProvider>
    <TaskProvider>
      <PomodoroProvider>
        <TimeBlockProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route path="/time-blocking" element={<TimeBlocking />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TimeBlockProvider>
      </PomodoroProvider>
    </TaskProvider>
  </AuthProvider>
);

export default App;
