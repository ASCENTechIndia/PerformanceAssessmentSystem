import { createPortal } from "react-dom";
import {
  X,
  ClipboardList,
  FileText,
  CheckSquare,
  Clock,
  Tag,
  CalendarDays,
  User,
} from "lucide-react";

const ViewTaskModal = ({ open, task, onClose }) => {
  if (!open || !task) return null;

  // Format Date
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl ring-1 ring-slate-200 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Brand accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-800">
                Task Details
              </h2>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Full overview of Task #{task.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Task Title & Status */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[18px] font-bold text-slate-800 leading-snug">
                {task.title}
              </h3>
              <span
                className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-bold shadow-sm flex-shrink-0"
                style={{
                  backgroundColor: task.bgColor || "#e2e8f0",
                  color: task.foreColor || "#334155",
                }}
              >
                {task.statusName}
              </span>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                <Tag className="w-3.5 h-3.5" /> Task Type
              </div>
              <p className="text-[13px] font-medium text-slate-800">
                {task.taskType || "—"}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5" /> Expected Duration
              </div>
              <p className="text-[13px] font-medium text-slate-800">
                {task.expectedDuration} Days
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                <CalendarDays className="w-3.5 h-3.5" /> Created On
              </div>
              <p className="text-[13px] font-medium text-slate-800">
                {formatDate(task.createdAt)}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                <User className="w-3.5 h-3.5" /> Assign To
              </div>
              <p className="text-[13px] font-medium text-slate-800">
                {task.assignTo}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                <User className="w-3.5 h-3.5" /> Assign By
              </div>
              <p className="text-[13px] font-medium text-slate-800">
                {task.assignBy}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h4 className="text-[13px] font-bold text-slate-800">
                Description
              </h4>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {task.description || (
                <span className="text-slate-400 italic">
                  No description provided.
                </span>
              )}
            </div>
          </div>

          {/* Completion Criteria */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <h4 className="text-[13px] font-bold text-slate-800">
                Completion Criteria
              </h4>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {task.completionCriteria || (
                <span className="text-slate-400 italic">
                  No specific criteria provided.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="submit-btn">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ViewTaskModal;
