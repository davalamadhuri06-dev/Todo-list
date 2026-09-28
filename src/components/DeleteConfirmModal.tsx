import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Task } from '../types/task';

interface DeleteConfirmModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900">Delete Task</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to permanently remove this task?
            </p>
            <div className="mt-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-800 line-clamp-2">
              "{task.title}"
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-xs shadow-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
