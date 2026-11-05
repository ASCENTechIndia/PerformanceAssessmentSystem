import { useState, useEffect } from "react";
import { Clock, Send, X } from "lucide-react";

const formatFullDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const QUICK_REASONS = [
  "Scope larger than expected",
  "Waiting on dependencies",
  "Need more information",
  "Resource constraints",
  "Review took longer",
];

const ExtensionModal = ({ open, onClose, task, onSubmit }) => {
  const [extraDays, setExtraDays] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setExtraDays("");
      setReason("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !task) return null;

  const daysNum = parseInt(extraDays, 10);
  const daysValid = !isNaN(daysNum) && daysNum >= 1 && daysNum <= 30;
  const reasonValid = reason.trim().length >= 10;
  const canSubmit = daysValid && reasonValid;

  const newDeadline = daysValid
    ? new Date(new Date(task.due).getTime() + daysNum * 86_400_000)
    : null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSubmit({ extraDays: daysNum, reason });
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

      <div className="relative w-full max-w-lg bg-white rounded-2xl ring-1 ring-slate-200 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400" />

        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                Request extension
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Ask your HOD for more time
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

        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
          <p className="text-[10.5px] font-mono font-semibold text-slate-400">
            {task.id}
          </p>
          <p className="text-[13.5px] font-semibold text-slate-800 mt-0.5 truncate">
            {task.title}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Current deadline:{" "}
            <span className="font-semibold text-slate-700">
              {formatFullDate(task.due)}
            </span>
          </p>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label htmlFor="extra-days" className="pas-label">
              Extra days needed <span className="text-rose-500">*</span>
            </label>
            <input
              id="extra-days"
              type="number"
              min={1}
              max={30}
              value={extraDays}
              onChange={(e) => setExtraDays(e.target.value)}
              placeholder="e.g. 3"
              className="pas-input"
              autoFocus
            />
            {newDeadline ? (
              <p className="pas-help">
                New deadline will be{" "}
                <span className="font-semibold text-sky-700">
                  {formatFullDate(newDeadline.toISOString())}
                </span>
              </p>
            ) : (
              <p className="pas-help">Between 1 and 30 days</p>
            )}
          </div>

          <div>
            <label htmlFor="reason" className="pas-label">
              Reason <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    reason === r
                      ? "bg-sky-100 text-sky-700 ring-1 ring-sky-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you need more time…"
              className="pas-input resize-none"
            />
            <p
              className={`text-[10.5px] mt-1 ${
                reasonValid ? "text-slate-400" : "text-rose-500"
              }`}
            >
              {reason.length} / 10 minimum characters
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="reset-btn" disabled={submitting}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="submit-btn disabled:opacity-50"
          >
            <Send className="w-4 h-4" strokeWidth={2.2} />
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionModal;
