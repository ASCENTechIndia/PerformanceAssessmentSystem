import { Trash2, X, AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({
  open,
  taskType,
  onClose,
  onConfirm,
  deleting,
}) => {
  if (!open || !taskType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-md bg-white rounded-2xl ring-1 ring-slate-200
        shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                Delete task type
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                This action cannot be undone
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
        <div className="px-5 py-4 space-y-3">
          <div className="p-3 rounded-lg bg-slate-50 ring-1 ring-slate-200">
            <p className="text-[10.5px] font-mono font-semibold text-slate-400">
              #{taskType.id}
            </p>
            <p className="text-[13.5px] font-semibold text-slate-800 mt-0.5">
              {taskType.name}
            </p>
            {taskType.description && (
              <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2">
                {taskType.description}
              </p>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-rose-50 ring-1 ring-rose-200 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-rose-800 leading-snug">
              Deleting <b>{taskType.name}</b> will remove it permanently. Any
              tasks assigned to this type may be affected.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="reset-btn" disabled={deleting}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="delete-btn disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.2} />
            {deleting ? "Deleting…" : "Delete task type"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
