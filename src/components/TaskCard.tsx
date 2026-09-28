import React from 'react';
import {
  Calendar,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Task, Priority } from '../types/task';
import { formatFriendlyDate, isDateOverdue, isDateToday } from '../utils/storage';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  viewMode: 'grid' | 'list';
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  viewMode,
}) => {
  const isToday = isDateToday(task.dueDate);
  const isOverdue = !task.completed && isDateOverdue(task.dueDate);
  const dateFormatted = formatFriendlyDate(task.dueDate);

  // Priority configuration
  const priorityConfig: Record<
    Priority,
    { label: string; textClass: string; dotClass: string; borderClass: string }
  > = {
    high: {
      label: 'High Priority',
      textClass: 'text-rose-700',
      dotClass: 'bg-rose-500',
      borderClass: 'border-l-rose-500',
    },
    medium: {
      label: 'Medium Priority',
      textClass: 'text-amber-700',
      dotClass: 'bg-amber-500',
      borderClass: 'border-l-amber-500',
    },
    low: {
      label: 'Low Priority',
      textClass: 'text-emerald-700',
      dotClass: 'bg-emerald-500',
      borderClass: 'border-l-emerald-500',
    },
  };

  const priorityMeta = priorityConfig[task.priority];

  // List view row format
  if (viewMode === 'list') {
    return (
      <div
        className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
          task.completed
            ? 'bg-slate-50/70 border-slate-200 text-slate-400'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
            className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-indigo-600 bg-white'
            }`}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Title & Details */}
          <div className="min-w-0 flex-1">
            <h3
              className={`text-sm sm:text-base font-semibold truncate transition-all ${
                task.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-900 group-hover:text-indigo-900'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-xs mt-0.5 line-clamp-1 ${
                  task.completed ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs mt-1.5 text-slate-500">
              <span className={`inline-flex items-center gap-1.5 font-medium ${priorityMeta.textClass}`}>
                <span className={`w-2 h-2 rounded-full ${priorityMeta.dotClass}`} />
                {priorityMeta.label}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span
                className={`inline-flex items-center gap-1 ${
                  isOverdue
                    ? 'text-rose-600 font-semibold'
                    : isToday
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {dateFormatted}
                {isOverdue && ' (Overdue)'}
                {isToday && ' (Today)'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid view card format
  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/80 border-slate-200'
          : 'bg-white border-slate-200/90 hover:border-slate-300/90 shadow-xs hover:shadow-sm'
      }`}
    >
      <div>
        {/* Top Header: Checkbox & Title */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
            className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-indigo-600 bg-white'
            }`}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-bold leading-snug break-words transition-all ${
                task.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-900 group-hover:text-indigo-950'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-xs sm:text-sm mt-1.5 leading-relaxed break-words ${
                  task.completed ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata and Action buttons */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        {/* Priority & Due Date Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority text with dot */}
          <span className={`inline-flex items-center gap-1.5 font-medium ${priorityMeta.textClass}`}>
            <span className={`w-2 h-2 rounded-full ${priorityMeta.dotClass}`} />
            {priorityMeta.label}
          </span>

          <span aria-hidden="true" className="text-slate-300">·</span>

          {/* Date info */}
          <span
            className={`inline-flex items-center gap-1 ${
              isOverdue
                ? 'text-rose-600 font-bold'
                : isToday
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            ) : isToday ? (
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{dateFormatted}</span>
            {isOverdue && <span className="text-[11px] uppercase">(Overdue)</span>}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          {task.completed && (
            <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-medium mr-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </span>
          )}
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
