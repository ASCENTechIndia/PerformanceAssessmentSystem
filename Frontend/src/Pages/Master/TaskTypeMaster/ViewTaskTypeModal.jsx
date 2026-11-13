import { LayoutList, X, Info } from "lucide-react";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ViewTaskTypeModal = ({ open, taskType, onClose }) => {
  if (!open || !taskType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg bg-white rounded-2xl ring-1 ring-slate-200
        shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <LayoutList className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                Task Type Details
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Read-only view
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 max-h-[55vh] overflow-y-auto">
          <div>
            <p className="pas-label">Task Type Name</p>
            <p className="text-[14px] font-semibold text-slate-800">
              {taskType.name}
            </p>
          </div>

          <div>
            <p className="pas-label">Status</p>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
              text-[10.5px] font-semibold ring-1
              ${
                taskType.active
                  ? "bg-blue-50 text-blue-700 ring-blue-200"
                  : "bg-slate-100 text-slate-500 ring-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${taskType.active ? "bg-blue-500" : "bg-slate-400"}`}
              />
              {taskType.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div>
            <p className="pas-label">Description</p>
            {taskType.description ? (
              <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3">
                <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {taskType.description}
                </p>
              </div>
            ) : (
              <p className="text-[11.5px] text-slate-400 italic">
                No description provided
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div>
              <p className="pas-label">Created By</p>
              <p className="text-[12.5px] font-medium text-slate-800">
                {taskType.createdBy}
              </p>
            </div>
            <div>
              <p className="pas-label">Created Date</p>
              <p className="text-[12.5px] font-medium text-slate-800">
                {formatDate(taskType.createdAt)}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/60 ring-1 ring-blue-100 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-800 leading-snug">
              To make changes, use the <b>Edit</b> action in the table.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="reset-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskTypeModal;
