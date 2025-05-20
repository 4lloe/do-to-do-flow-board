
import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import { useTasks, Task } from '../contexts/TaskContext';
import { List, LayoutGrid, Check, Trash2, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

type ViewMode = 'list' | 'board';
type TaskCategory = Task['category'];

const TaskForm: React.FC<{ 
  category: TaskCategory;
  onAddTask: (task: string) => void;
}> = ({ category, onAddTask }) => {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center mb-2">
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add task..."
        className="w-full p-2 rounded-md bg-secondary text-white border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={!taskText.trim()}
        className="ml-2 p-2 rounded-md bg-primary text-white hover:bg-primary/80 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
};

const TaskItem: React.FC<{
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ task, onToggleComplete, onDelete }) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-priority-low';
      case 'medium': return 'bg-priority-medium';
      case 'high': return 'bg-priority-high';
      default: return 'bg-priority-low';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-secondary mb-2 group">
      <div className="flex items-center gap-3 flex-grow">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`h-5 w-5 rounded border flex items-center justify-center ${
            task.completed ? 'bg-primary border-primary' : 'border-gray-500'
          }`}
        >
          {task.completed && <Check className="h-3 w-3 text-white" />}
        </button>
        <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {task.dueDate && (
          <span className="text-xs text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
        )}
        <div className={`h-2 w-2 rounded-full ${getPriorityClass(task.priority)}`}></div>
        <button 
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const TaskCategory: React.FC<{
  title: string;
  tasks: Task[];
  category: TaskCategory;
  onAddTask: (task: string, category: TaskCategory) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}> = ({ title, tasks, category, onAddTask, onToggleComplete, onDeleteTask }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <TaskForm 
        category={category}
        onAddTask={(text) => onAddTask(text, category)} 
      />
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
        />
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-4 text-gray-500">No tasks</div>
      )}
    </div>
  );
};

const Tasks: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { tasks, addTask, toggleTaskCompleted, deleteTask, getTasksByCategory } = useTasks();
  const { toast } = useToast();

  const handleAddTask = (text: string, category: TaskCategory) => {
    addTask({
      title: text,
      completed: false,
      priority: 'medium',
      category
    });
    
    toast({
      title: "Task added",
      description: `"${text}" has been added to your tasks.`,
    });
  };

  const handleToggleComplete = (id: string) => {
    toggleTaskCompleted(id);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast({
      title: "Task deleted",
      variant: "destructive",
    });
  };

  const todayTasks = getTasksByCategory('today');
  const tomorrowTasks = getTasksByCategory('tomorrow');
  const thisWeekTasks = getTasksByCategory('this-week');
  const nextWeekTasks = getTasksByCategory('next-week');
  const laterTasks = getTasksByCategory('later');

  return (
    <AppLayout>
      <Header title="Tasks" />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-secondary rounded-md p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' ? 'bg-muted text-white' : 'text-gray-400'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-md ${
                viewMode === 'board' ? 'bg-muted text-white' : 'text-gray-400'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {viewMode === 'list' && (
          <div>
            <TaskCategory
              title="Today"
              tasks={todayTasks}
              category="today"
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
            <TaskCategory
              title="Tomorrow"
              tasks={tomorrowTasks}
              category="tomorrow"
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
            <TaskCategory
              title="On this week"
              tasks={thisWeekTasks}
              category="this-week"
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
            <TaskCategory
              title="On next week"
              tasks={nextWeekTasks}
              category="next-week"
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
            <TaskCategory
              title="Later"
              tasks={laterTasks}
              category="later"
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}
        
        {viewMode === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-3">Today</h3>
              <TaskForm 
                category="today"
                onAddTask={(text) => handleAddTask(text, 'today')} 
              />
              {todayTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-3">Tomorrow</h3>
              <TaskForm 
                category="tomorrow"
                onAddTask={(text) => handleAddTask(text, 'tomorrow')} 
              />
              {tomorrowTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-3">On this week</h3>
              <TaskForm 
                category="this-week"
                onAddTask={(text) => handleAddTask(text, 'this-week')} 
              />
              {thisWeekTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-3">On next week</h3>
              <TaskForm 
                category="next-week"
                onAddTask={(text) => handleAddTask(text, 'next-week')} 
              />
              {nextWeekTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-medium mb-3">Later</h3>
              <TaskForm 
                category="later"
                onAddTask={(text) => handleAddTask(text, 'later')} 
              />
              {laterTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Tasks;
