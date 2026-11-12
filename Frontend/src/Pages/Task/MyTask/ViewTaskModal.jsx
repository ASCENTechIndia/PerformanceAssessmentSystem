import React from "react";
import {
  X,
  ClipboardList,
  CalendarDays,
  Flag,
  Clock,
  CheckCircle2,
  User,
  FileText,
  Paperclip,
  Download,
  FileImage,
  File,
  MessageSquare,
  ShieldAlert,
  Send,
  UserCheck,
  Timer,
  ListChecks,
} from "lucide-react";

/* ---------- Helpers ---------- */
const formatDate = (date) => {
  if (!date) return "—";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
};

const getFileIcon = (fileName) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) return FileImage;
  if (ext === "pdf") return FileText;
  return File;
};

const daysUntil = (iso) => {
  if (!iso) return null;
  return Math.ceil(
    (new Date(`${iso}T00:00:00`) - new Date().setHours(0, 0, 0, 0)) /
      86_400_000,
  );
};

/* ---------- Style maps (match the rest of the app) ---------- */
const statusStyles = {
  Assigned: "bg-slate-100  text-slate-700   ring-slate-200",
  "In Progress": "bg-sky-50     text-sky-700     ring-sky-200",
  Submitted: "bg-amber-50   text-amber-700   ring-amber-200",
  Rejected: "bg-rose-50    text-rose-700    ring-rose-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const priorityStyles = {
  High: "bg-rose-50  text-rose-700  ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-slate-50 text-slate-600  ring-slate-200",
};

/* ---------- Small sub-components ---------- */
const InfoTile = ({ label, value, icon: Icon, children }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-500 mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </div>
    {children || (
      <p className="text-[12.5px] font-semibold text-slate-800 break-words">
        {value || "—"}
      </p>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, color = "emerald", children }) => {
  const palette = {
    emerald: "from-emerald-400 to-teal-500",
    violet: "from-violet-400 to-purple-500",
    amber: "from-amber-400 to-orange-500",
    sky: "from-sky-400 to-blue-500",
    rose: "from-rose-400 to-pink-500",
  }[color];

  return (
    <h4 className="flex items-center gap-2 mb-2.5">
      <div
        className={`w-6 h-6 rounded-md bg-gradient-to-br ${palette} text-white
        flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-3 h-3" strokeWidth={2.4} />
      </div>
      <span className="text-[12px] font-semibold text-slate-800">
        {children}
      </span>
    </h4>
  );
};

/* ============================================================
   MODAL
   ============================================================ */
const ViewTaskModal = ({ open, task, onClose }) => {
  if (!open || !task) return null;

  const attachments = task.attachments || [];
  const days = daysUntil(task.due);
  const isOverdue = days !== null && days < 0 && task.status !== "Completed";

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl ring-1 ring-slate-200
        shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
      >
        {/* Brand strip */}
        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

        {/* ================= Header ================= */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                Task Details
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Complete task information and history
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= Summary bar ================= */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10.5px] font-mono font-semibold text-slate-400">
              {task.id}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
              text-[10px] font-semibold ring-1 ${statusStyles[task.status] || statusStyles.Assigned}`}
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              {task.status}
            </span>
            {isOverdue && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                text-[10px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200"
              >
                <Timer className="w-2.5 h-2.5" />
                {Math.abs(days)}d overdue
              </span>
            )}
          </div>
          <p className="text-[14px] font-semibold text-slate-800 leading-snug">
            {task.title}
          </p>
        </div>

        {/* ================= Body ================= */}
        <div className="px-5 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* --- Quick stats strip --- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div
              className={`flex items-center gap-2 p-2.5 rounded-lg ring-1 ${
                task.priority
                  ? priorityStyles[task.priority]
                  : priorityStyles.Low
              }`}
            >
              <Flag className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
                  Priority
                </p>
                <p className="text-[12px] font-bold truncate">
                  {task.priority || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-200">
              <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
                  Due
                </p>
                <p className="text-[12px] font-bold truncate">
                  {formatDate(task.due)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-violet-50 text-violet-700 ring-1 ring-violet-200">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
                  Type
                </p>
                <p className="text-[12px] font-bold truncate">
                  {task.type || "—"}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 p-2.5 rounded-lg ring-1 ${
                isOverdue
                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                  : "bg-emerald-50 text-emerald-700 ring-emerald-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
                  {isOverdue ? "Overdue by" : "Time left"}
                </p>
                <p className="text-[12px] font-bold truncate">
                  {task.status === "Completed"
                    ? "Done"
                    : days === null
                      ? "—"
                      : days < 0
                        ? `${Math.abs(days)}d`
                        : days === 0
                          ? "Today"
                          : `${days}d`}
                </p>
              </div>
            </div>
          </div>

          {/* --- Assignment section --- */}
          <div>
            <SectionHeader icon={UserCheck} color="emerald">
              Assignment
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <InfoTile
                label="Assigned To"
                value={task.assignedTo || "—"}
                icon={User}
              />
              <InfoTile
                label="Assigned By"
                value={task.assignedBy || "HOD"}
                icon={UserCheck}
              />
              <InfoTile
                label="Assigned On"
                value={formatDate(task.assigned)}
                icon={CalendarDays}
              />
              <InfoTile
                label="Expected Start"
                value={formatDate(task.expectedStart || task.assigned)}
                icon={Clock}
              />
            </div>
          </div>

          {/* --- Description --- */}
          {task.description && (
            <div>
              <SectionHeader icon={FileText} color="violet">
                Description
              </SectionHeader>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            </div>
          )}

          {/* --- Instructions (from Assign Task) --- */}
          {task.instructions && (
            <div>
              <SectionHeader icon={MessageSquare} color="sky">
                Instructions for Assignee
              </SectionHeader>
              <div className="rounded-lg bg-sky-50/50 ring-1 ring-sky-100 p-3">
                <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {task.instructions}
                </p>
              </div>
            </div>
          )}

          {/* --- Completion Criteria --- */}
          {task.completionCriteria && (
            <div>
              <SectionHeader icon={ListChecks} color="emerald">
                Completion Criteria
              </SectionHeader>
              <div className="rounded-lg bg-emerald-50/50 ring-1 ring-emerald-100 p-3">
                <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {task.completionCriteria}
                </p>
              </div>
            </div>
          )}

          {/* --- Rejection reason (only if rejected) --- */}
          {task.status === "Rejected" && task.rejectionReason && (
            <div>
              <SectionHeader icon={ShieldAlert} color="rose">
                Rejection Feedback
              </SectionHeader>
              <div className="rounded-lg bg-rose-50 ring-1 ring-rose-200 p-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-rose-700 mb-1">
                  Reason
                </p>
                <p className="text-[12.5px] text-rose-900 leading-relaxed whitespace-pre-wrap">
                  {task.rejectionReason}
                </p>
                {task.rejectedBy && (
                  <p className="text-[10.5px] text-rose-600 mt-2">
                    Rejected by <b>{task.rejectedBy}</b>
                    {task.rejectedOn && ` · ${formatDate(task.rejectedOn)}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* --- Submission remarks (only if submitted/completed) --- */}
          {(task.status === "Submitted" || task.status === "Completed") &&
            task.submissionRemarks && (
              <div>
                <SectionHeader icon={Send} color="amber">
                  Submission Remarks
                </SectionHeader>
                <div className="rounded-lg bg-amber-50/50 ring-1 ring-amber-100 p-3">
                  <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {task.submissionRemarks}
                  </p>
                  {task.submittedOn && (
                    <p className="text-[10.5px] text-amber-700 mt-2">
                      Submitted on {formatDate(task.submittedOn)}
                    </p>
                  )}
                </div>
              </div>
            )}

          {/* --- Attachments --- */}
          <div>
            <SectionHeader icon={Paperclip} color="sky">
              Attached Documents
              <span className="text-[10px] font-medium text-slate-400 ml-1">
                ({attachments.length})
              </span>
            </SectionHeader>

            {attachments.length > 0 ? (
              <div className="space-y-2">
                {attachments.map((file, index) => {
                  const FileIcon = getFileIcon(file.name);
                  return (
                    <div
                      key={file.id || index}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white
                        hover:border-sky-200 hover:bg-sky-50/30 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500
                        text-white flex items-center justify-center flex-shrink-0"
                      >
                        <FileIcon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[12px] font-medium text-slate-800 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload(file)}
                        className="p-2 rounded-lg text-sky-600 hover:bg-sky-100 transition-colors flex-shrink-0"
                        title="Download"
                        aria-label={`Download ${file.name}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-6 rounded-lg
                border border-dashed border-slate-200 bg-slate-50/50"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                  <Paperclip className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11.5px] font-medium text-slate-600">
                  No documents attached
                </p>
                <p className="text-[10.5px] text-slate-400 mt-0.5">
                  No files are available for this task.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= Footer ================= */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-[10.5px] text-slate-500 hidden sm:block">
            {task.updatedOn
              ? `Last updated ${formatDate(task.updatedOn)}`
              : `Assigned ${formatDate(task.assigned)}`}
          </p>
          <button type="button" onClick={onClose} className="reset-btn ml-auto">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
