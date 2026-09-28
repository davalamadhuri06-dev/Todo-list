import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, TrendingUp } from 'lucide-react';
import { Task } from '../types/task';

interface DashboardProps {
  tasks: Task[];
  onSelectFilter?: (filter: 'all' | 'pending' | 'completed' | 'high') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, onSelectFilter }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Motivational message based on completion rate
  let motivationMessage = 'Add your first task to get started!';
  if (totalTasks > 0) {
    if (completionPercentage === 100) {
      motivationMessage = '🎉 Incredible job! All tasks are completed!';
    } else if (completionPercentage >= 75) {
      motivationMessage = '🚀 Almost done! Just a few more tasks to go.';
    } else if (completionPercentage >= 50) {
      motivationMessage = '💪 Great momentum! You are halfway there.';
    } else if (completionPercentage > 0) {
      motivationMessage = '✨ Nice start! Keep ticking tasks off.';
    } else {
      motivationMessage = 'Ready to conquer today? Start by checking off a task.';
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Task Progress Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time overview of your productivity and pending deliverables
          </p>
        </div>

        {/* Completion % Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-xs font-semibold text-slate-600">Rate:</span>
          <span className="text-sm font-bold text-indigo-600 tabular-nums">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Total Tasks */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('all')}
          className="text-left p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalTasks}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">In your repository</span>
        </button>

        {/* Completed Tasks */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('completed')}
          className="text-left p-4 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
            {completedTasks}
          </div>
          <span className="text-xs text-emerald-600/80 mt-1 block">Successfully finished</span>
        </button>

        {/* Pending Tasks */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('pending')}
          className="text-left p-4 rounded-xl bg-amber-50/60 hover:bg-amber-50 border border-amber-200/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 tabular-nums">
            {pendingTasks}
          </div>
          <span className="text-xs text-amber-600/80 mt-1 block">Awaiting completion</span>
        </button>

        {/* High Priority Pending */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('high')}
          className="text-left p-4 rounded-xl bg-rose-50/60 hover:bg-rose-50 border border-rose-200/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 tabular-nums">
            {highPriorityTasks}
          </div>
          <span className="text-xs text-rose-600/80 mt-1 block">Need urgent attention</span>
        </button>
      </div>

      {/* Progress Bar Section */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700">Completion Status</span>
          <span className="text-slate-500 font-medium">
            <strong className="text-slate-900 tabular-nums">{completedTasks}</strong> of{' '}
            <strong className="text-slate-900 tabular-nums">{totalTasks}</strong> completed ({completionPercentage}%)
          </span>
        </div>

        {/* Track & Indicator */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              completionPercentage === 100
                ? 'bg-emerald-500'
                : completionPercentage >= 50
                ? 'bg-indigo-600'
                : 'bg-indigo-500'
            }`}
            style={{ width: `${Math.max(completionPercentage, totalTasks > 0 ? 3 : 0)}%` }}
          />
        </div>

        {/* Motivational message */}
        <p className="text-xs text-slate-500 italic mt-1.5 flex items-center gap-1.5">
          <span>{motivationMessage}</span>
        </p>
      </div>
    </div>
  );
};
