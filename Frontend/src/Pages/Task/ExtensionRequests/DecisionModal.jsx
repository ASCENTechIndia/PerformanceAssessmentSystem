import { useState, useEffect } from "react";
import {
  Check,
  X,
  XCircle,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

const formatFullDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const QUICK_REASONS = [
  "Extension not justified",
  "Deadline is firm",
  "Request more info first",
  "Scope should have been flagged earlier",
];

const DecisionModal = ({ open, mode, request, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !request) return null;

  const isReject = mode === "reject";
  const reasonValid = reason.trim().length >= 10;
  const canSubmit = !isReject || reasonValid;

  const newDeadline = new Date(
    new Date(request.currentDeadline).getTime() +
      request.requestedExtraDays * 86_400_000,
  ).toISOString();

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onConfirm({ mode, request, reason });
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
        <div
          className={`h-[3px] w-full ${
            isReject
              ? "bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500"
              : "bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400"
          }`}
        />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isReject
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isReject ? (
                <XCircle className="w-5 h-5" strokeWidth={2.2} />
              ) : (
                <CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />
              )}
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                {isReject
                  ? "Reject extension request"
                  : "Approve extension request"}
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                {isReject
                  ? "Employee keeps original deadline"
                  : "Task deadline will be extended"}
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
            {request.taskId} · {request.id}
          </p>
          <p className="text-[13.5px] font-semibold text-slate-800 mt-0.5 truncate">
            {request.taskTitle}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Requested by{" "}
            <span className="font-medium text-slate-700">
              {request.employee}
            </span>{" "}
            · {request.requestedExtraDays} extra day
            {request.requestedExtraDays !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[50vh] overflow-y-auto">
          {/* Deadline preview — same info as card, key context */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-slate-600">
                {formatFullDate(request.currentDeadline)}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span
                className={
                  isReject
                    ? "text-slate-500 line-through"
                    : "text-emerald-700 font-semibold"
                }
              >
                {formatFullDate(newDeadline)}
              </span>
              {!isReject && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1 py-0.5 rounded">
                  NEW
                </span>
              )}
            </div>
          </div>

          {/* Reason block */}
          {isReject ? (
            <div>
              <label htmlFor="reject-reason" className="pas-label">
                Reason for rejection <span className="text-rose-500">*</span>
              </label>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUICK_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      reason === r
                        ? "bg-rose-100 text-rose-700 ring-1 ring-rose-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <textarea
                id="reject-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain to the employee why the extension isn't approved…"
                className="pas-input resize-none"
                autoFocus
              />
              <p
                className={`text-[10.5px] mt-1 ${
                  reasonValid ? "text-slate-400" : "text-rose-500"
                }`}
              >
                {reason.length} / 10 minimum characters
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/60 ring-1 ring-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-emerald-800 leading-relaxed">
                The task will stay <b>In Progress</b> and the deadline will move
                to <b>{formatFullDate(newDeadline)}</b>. The employee will be
                notified.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="reset-btn" disabled={submitting}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canSubmit || submitting}
            className={`${isReject ? "delete-btn" : "submit-btn"} disabled:opacity-50`}
          >
            {isReject ? (
              <>
                <XCircle className="w-4 h-4" strokeWidth={2.2} />
                {submitting ? "Rejecting…" : "Reject request"}
              </>
            ) : (
              <>
                <Check className="w-4 h-4" strokeWidth={2.4} />
                {submitting ? "Approving…" : "Approve extension"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;
