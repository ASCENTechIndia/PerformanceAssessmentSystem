import { useState, useEffect } from "react";
import { XCircle, X } from "lucide-react";

const REJECT_REASONS = [
  "Not my responsibility",
  "Insufficient information",
  "Wrong assignment",
  "Out of scope for my role",
  "Other",
];

const RejectTaskModal = ({ open, task, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setDetails("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !task) return null;

  const detailsRequired = reason === "Other";
  const detailsValid = !detailsRequired || details.trim().length >= 10;
  const canSubmit = !!reason && detailsValid;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSubmit({ reason, details });
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="h-[3px] w-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                Reject task
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Send this task back to your HOD
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

        {/* Task summary */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
          <p className="text-[10.5px] font-mono font-semibold text-slate-400">
            {task.id}
          </p>
          <p className="text-[13.5px] font-semibold text-slate-800 mt-0.5 truncate">
            {task.title}
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
          <div>
            <label htmlFor="reject-reason" className="pas-label">
              Reason <span className="text-rose-500">*</span>
            </label>
            <select
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="pas-input"
              autoFocus
            >
              <option value="">Select a reason…</option>
              {REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reject-details" className="pas-label">
              Details{" "}
              {detailsRequired ? (
                <span className="text-rose-500">*</span>
              ) : (
                <span className="text-slate-400 normal-case font-normal">
                  (optional)
                </span>
              )}
            </label>
            <textarea
              id="reject-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={
                detailsRequired
                  ? "Please explain why this task isn't appropriate for you…"
                  : "Add any additional context…"
              }
              className="pas-input resize-none"
            />
            {detailsRequired && (
              <p
                className={`text-[10.5px] mt-1 ${
                  details.trim().length >= 10
                    ? "text-slate-400"
                    : "text-rose-500"
                }`}
              >
                {details.length} / 10 minimum characters
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-rose-50/60 ring-1 ring-rose-100">
            <p className="text-[11px] text-rose-800 leading-relaxed">
              <b>Note:</b> Rejecting returns the task to your HOD's queue. Your
              HOD will decide whether to reassign it or discuss with you.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="reset-btn" disabled={submitting}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="delete-btn disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" strokeWidth={2.2} />
            {submitting ? "Rejecting…" : "Reject task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectTaskModal;
