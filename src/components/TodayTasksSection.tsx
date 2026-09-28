import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Task } from '../types/task';
import { isDateToday } from '../utils/storage';
import { TaskCard } from './TaskCard';

interface TodayTasksSectionProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onOpenAddTask: () => void;
  viewMode: 'grid' | 'list';
}

export const TodayTasksSection: React.FC<TodayTasksSectionProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenAddTask,
  viewMode,
}) => {
  const todayTasks = tasks.filter((t) => isDateToday(t.dueDate));
  const completedCount = todayTasks.filter((t) => t.completed).length;

  if (todayTasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center my-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Tasks Scheduled for Today</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
          You are all clear today! You can add a quick task or review upcoming deadlines below.
        </p>
        <button
          onClick={onOpenAddTask}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task for Today</span>
        </button>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Today's Schedule
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {completedCount}/{todayTasks.length} Done
          </span>
        </div>

        <button
          onClick={onOpenAddTask}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Add</span>
        </button>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }
      >
        {todayTasks.map((task) => (
          <TaskCard
            key={`today-${task.id}`}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        ))}
      </div>
    </section>
  );
};
