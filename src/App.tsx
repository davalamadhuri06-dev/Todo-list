/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  getInitialDemoTasks,
  isDateToday,
} from './utils/storage';
import { Task, Priority, FilterType, SortType, TaskFormData } from './types/task';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { Dashboard } from './components/Dashboard';
import { TaskFilters } from './components/TaskFilters';
import { TaskCard } from './components/TaskCard';
import { TodayTasksSection } from './components/TodayTasksSection';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import {
  Plus,
  ClipboardList,
  CheckCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function App() {
  // Main tasks state initialized from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());

  // Navigation tab: 'all' | 'today' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'dashboard'>('all');

  // Filter & Search states
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('dueDateAsc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal dialog states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize tasks with localStorage whenever tasks state updates
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Show auto-dismissing toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Handler: Add or update task
  const handleSaveTask = (data: TaskFormData, editingId?: string) => {
    if (editingId) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                title: data.title,
                description: data.description,
                priority: data.priority,
                dueDate: data.dueDate,
              }
            : t
        )
      );
      showToast('Task updated successfully!');
    } else {
      // Add new task
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('New task added!');
    }
    setEditingTask(null);
  };

  // Handler: Toggle task completion
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            showToast('Task completed! Keep it up! 🎯');
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // Handler: Open edit modal
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Handler: Open delete modal
  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
  };

  // Handler: Confirm deletion
  const handleConfirmDelete = () => {
    if (deletingTask) {
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      showToast('Task deleted.');
      setDeletingTask(null);
    }
  };

  // Handler: Reset to starter demo tasks
  const handleResetDemo = () => {
    const demos = getInitialDemoTasks();
    setTasks(demos);
    saveTasksToStorage(demos);
    showToast('Reset to demo sample tasks.');
  };

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      high: tasks.filter((t) => t.priority === 'high' && !t.completed).length,
    };
  }, [tasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Tab check if on 'today' tab
        if (activeTab === 'today') {
          if (!isDateToday(task.dueDate)) return false;
        }

        // Status Filter
        if (filter === 'pending' && task.completed) return false;
        if (filter === 'completed' && !task.completed) return false;
        if (filter === 'high' && task.priority !== 'high') return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q) ?? false;
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        }
        if (sortBy === 'dueDateDesc') {
          return (b.dueDate || '').localeCompare(a.dueDate || '');
        }
        if (sortBy === 'priority') {
          const priorityWeight: Record<Priority, number> = {
            high: 3,
            medium: 2,
            low: 1,
          };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [tasks, filter, searchQuery, sortBy, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenAddTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onResetDemo={handleResetDemo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Hero / Home Greeting Banner */}
      <HomeHero
        tasks={tasks}
        onOpenAddTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onFilterToday={() => {
          setActiveTab('today');
          setFilter('all');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Dashboard Section */}
        {(activeTab === 'dashboard' || activeTab === 'all') && (
          <Dashboard
            tasks={tasks}
            onSelectFilter={(newFilter) => {
              setActiveTab('all');
              setFilter(newFilter);
            }}
          />
        )}

        {/* Display Today's Tasks prominently */}
        {(activeTab === 'today' || activeTab === 'all') && (
          <TodayTasksSection
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onOpenAddTask={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            viewMode={viewMode}
          />
        )}

        {/* All Tasks List Header & Section */}
        {activeTab !== 'today' && (
          <section id="tasks-section" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  Task List
                </h2>
                <p className="text-xs text-slate-500">
                  Manage, filter, prioritize, and check off your assignments
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-200 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create Task</span>
              </button>
            </div>

            {/* Filter Controls (All, Pending, Completed, High Priority + Search + Sort) */}
            <TaskFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={counts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Task Items Render */}
            {filteredTasks.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {searchQuery
                    ? 'No tasks matched your search'
                    : filter !== 'all'
                    ? `No ${filter} tasks found`
                    : 'No tasks in your list yet'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  {searchQuery
                    ? 'Try searching with different keywords or clear the search filter.'
                    : 'Start your productive day by adding your first task.'}
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setIsTaskModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Task</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Grid or List of Tasks */
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-3'
                }
              >
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">TaskEase</span>
            <span aria-hidden="true">·</span>
            <span>Simple & Attractive Task Manager</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-medium">Data auto-saved locally</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Built with HTML, CSS, JavaScript & localStorage</span>
          </div>
        </div>
      </footer>

      {/* Task Add / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
