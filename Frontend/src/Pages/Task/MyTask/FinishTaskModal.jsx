import { useState, useEffect, useRef } from "react";
import { Send, X, Upload, FileText, Trash2 } from "lucide-react";

const FinishTaskModal = ({
  open,
  task,
  docsMandatory = false,
  onClose,
  onSubmit,
}) => {
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setRemarks("");
      setFile(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !task) return null;

  const remarksValid = remarks.trim().length >= 10;
  const fileValid = !docsMandatory || !!file;
  const canSubmit = remarksValid && fileValid;

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSubmit({ remarks, file });
    } finally {
      setSubmitting(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1_048_576).toFixed(1)} MB`;
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
        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                Mark as finished
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Send this task to your HOD for review
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
          <p className="text-[11px] text-slate-500 mt-1">
            Type:{" "}
            <span className="font-medium text-slate-700">{task.type}</span> ·
            Priority:{" "}
            <span className="font-medium text-slate-700">{task.priority}</span>
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
          {/* Completion remarks */}
          <div>
            <label htmlFor="finish-remarks" className="pas-label">
              Completion remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="finish-remarks"
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe what was completed, outcomes, and any notes for the reviewer…"
              className="pas-input resize-none"
              autoFocus
            />
            <p
              className={`text-[10.5px] mt-1 ${remarksValid ? "text-slate-400" : "text-rose-500"}`}
            >
              {remarks.length} / 10 minimum characters
            </p>
          </div>

          {/* File upload */}
          <div>
            <label className="pas-label">
              Supporting document{" "}
              {docsMandatory ? (
                <span className="text-rose-500">*</span>
              ) : (
                <span className="text-slate-400 normal-case font-normal">
                  (optional)
                </span>
              )}
            </label>

            {docsMandatory && (
              <div className="mb-2 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 ring-1 ring-amber-200">
                <FileText className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-snug">
                  This task type <b>requires</b> a supporting document. Please
                  attach one before submitting.
                </p>
              </div>
            )}

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-1 p-4 rounded-lg
                  border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30
                  transition-colors"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-[12px] font-medium text-slate-700">
                  Click to upload
                </span>
                <span className="text-[10.5px] text-slate-400">
                  PDF, JPG, PNG · max 5 MB
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[12px] font-medium text-slate-800 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-[10.5px] text-slate-500">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  aria-label="Remove file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
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
            className="submit-btn disabled:opacity-50"
          >
            <Send className="w-4 h-4" strokeWidth={2.2} />
            {submitting ? "Submitting…" : "Submit for review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishTaskModal;
