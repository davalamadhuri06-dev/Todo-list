import React from 'react';
import { Plus, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { isDateToday } from '../utils/storage';
import { Task } from '../types/task';

interface HomeHeroProps {
  tasks: Task[];
  onOpenAddTask: () => void;
  onFilterToday: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  tasks,
  onOpenAddTask,
  onFilterToday,
}) => {
  const todayTasks = tasks.filter((t) => isDateToday(t.dueDate));
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const pendingToday = todayTasks.filter((t) => !t.completed).length;
  
  const totalCompleted = tasks.filter((t) => t.completed).length;
  const totalPending = tasks.filter((t) => !t.completed).length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-gradient-to-b from-indigo-50/70 via-white to-white border-b border-slate-200/80 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Hero Title & Tagline */}
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-md">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Organize Your Day
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Welcome to <span className="font-semibold text-indigo-600">TaskEase</span> — a clean and modern task planner designed to keep your studies, assignments, and daily goals on track with zero clutter.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAddTask}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm rounded-lg shadow-sm shadow-indigo-200 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Task</span>
              </button>

              <button
                onClick={onFilterToday}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-sm rounded-lg transition-colors"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>View Today ({todayTasks.length})</span>
              </button>
            </div>
          </div>

          {/* Right Summary Cards for Today */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            {/* Today's Tasks */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
                <span>Today's Tasks</span>
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  {todayTasks.length}
                </span>
                <span className="text-xs text-slate-400">due today</span>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="text-xs font-medium text-emerald-700 flex items-center justify-between">
                <span>Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-emerald-700 tabular-nums">
                  {completedToday}
                </span>
                <span className="text-xs text-slate-400">
                  / {totalCompleted} total
                </span>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="text-xs font-medium text-amber-700 flex items-center justify-between">
                <span>Pending</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-amber-700 tabular-nums">
                  {pendingToday}
                </span>
                <span className="text-xs text-slate-400">
                  / {totalPending} total
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
