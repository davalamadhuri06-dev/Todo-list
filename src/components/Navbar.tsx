import React from 'react';
import { CheckSquare2, Plus, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenAddTask: () => void;
  onResetDemo: () => void;
  activeTab: 'all' | 'today' | 'dashboard';
  setActiveTab: (tab: 'all' | 'today' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddTask,
  onResetDemo,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <CheckSquare2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <button
            onClick={() => setActiveTab('all')}
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
          >
            TaskEase
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'today'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Today's Focus
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetDemo}
            title="Reset sample tasks"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
