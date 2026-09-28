import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Sparkles } from 'lucide-react';
import { Priority, Task, TaskFormData } from '../types/task';
import { formatDateToISO } from '../utils/storage';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskFormData, editingId?: string) => void;
  editingTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(formatDateToISO(new Date()));
  const [error, setError] = useState('');

  // Synchronize state when modal opens or editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate || formatDateToISO(new Date()));
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(formatDateToISO(new Date()));
    }
    setError('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
      },
      editingTask ? editingTask.id : undefined
    );

    onClose();
  };

  // Quick date helper
  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDueDate(formatDateToISO(d));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {editingTask
                ? 'Update your task details, priority or deadline'
                : 'Fill in the information below to schedule your task'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Complete Database Management assignment"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>
            )}
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, steps, or reference links..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Low */}
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'low'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Low
              </button>

              {/* Medium */}
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'medium'
                    ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium
              </button>

              {/* High */}
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                High
              </button>
            </div>
          </div>

          {/* Due Date & Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            />

            {/* Quick date chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Quick set:</span>
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="text-[11px] font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="text-[11px] font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(3)}
                className="text-[11px] font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
              >
                In 3 Days
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(7)}
                className="text-[11px] font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
              >
                Next Week
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingTask ? 'Save Changes' : 'Add Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
