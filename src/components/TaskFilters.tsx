import React from 'react';
import { Search, LayoutGrid, List, ArrowDownUp, X } from 'lucide-react';
import { FilterType, SortType } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
    high: number;
  };
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
  viewMode,
  onViewModeChange,
}) => {
  const filterTabs: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'high', label: 'High Priority', count: counts.high },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Filter Tabs & View Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto max-w-full">
          {filterTabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full tabular-nums font-bold ${
                    isActive
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-slate-300/60 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Grid vs List */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-end md:self-auto border border-slate-200/80">
          <button
            onClick={() => onViewModeChange('grid')}
            title="Card Grid view"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            title="Compact List view"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom row: Search input + Sorting select */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or details..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className="w-full pl-8 pr-7 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="dueDateAsc">Due Date (Earliest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="newest">Recently Added</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
