import { useState, useMemo } from "react";
import {
  Search,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../../Components/Layout";

/* ---------- Dynamic dummy data — always "recent" ---------- */
const now = Date.now();
const hoursAgo = (h) => new Date(now - h * 3_600_000).toISOString();

const MOCK_SUBMITTED = [
  {
    id: "T-112",
    title: "Quarterly Vendor Inspection",
    employee: "Priya Menon",
    empId: "e102",
    type: "Inspection",
    priority: "High",
    due: "2026-11-03",
    submittedAt: hoursAgo(50),
    submittedNote:
      "Full inspection completed across all 12 vendors. Report with photographic evidence attached.",
    attachments: 3,
  },
  {
    id: "T-115",
    title: "Safety Compliance Checklist",
    employee: "Sneha Iyer",
    empId: "e104",
    type: "Inspection",
    priority: "High",
    due: "2026-11-02",
    submittedAt: hoursAgo(28),
    submittedNote:
      "Checklist signed off by department safety officer. All 24 items marked compliant.",
    attachments: 1,
  },
  {
    id: "T-103",
    title: "Monthly Attendance Review",
    employee: "Amit Patel",
    empId: "e103",
    type: "Review",
    priority: "Low",
    due: "2026-11-08",
    submittedAt: hoursAgo(5),
    submittedNote:
      "Attendance summary prepared for October. Flagged 3 employees with irregular patterns.",
    attachments: 2,
  },
  {
    id: "T-109",
    title: "Equipment Maintenance Log",
    employee: "Ravi Sharma",
    empId: "e101",
    type: "Report",
    priority: "Medium",
    due: "2026-11-14",
    submittedAt: hoursAgo(3),
    submittedNote:
      "Log updated for all equipment in Zone A. Two units need replacement — noted in the sheet.",
    attachments: 1,
  },
  {
    id: "T-118",
    title: "Monthly Expense Summary",
    employee: "Amit Patel",
    empId: "e103",
    type: "Report",
    priority: "Medium",
    due: "2026-11-06",
    submittedAt: hoursAgo(1),
    submittedNote:
      "Summary for October is ready. Variances of more than 10% explained in the notes column.",
    attachments: 1,
  },
];

const EMPLOYEES = [
  { id: "e101", name: "Ravi Sharma" },
  { id: "e102", name: "Priya Menon" },
  { id: "e103", name: "Amit Patel" },
  { id: "e104", name: "Sneha Iyer" },
];

const priorityStyles = {
  High: "bg-rose-50  text-rose-700  ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-slate-50 text-slate-600  ring-slate-200",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const waitHours = (iso) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);

/* ============================================================
   REVIEW MODAL — approve or reject, one component
   ============================================================ */
const ReviewModal = ({ mode, task, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isReject = mode === "reject";
  const reasonValid = reason.trim().length >= 10;

  const quickReasons = [
    "Incomplete work",
    "Incorrect data",
    "Missing attachments",
    "Quality below expected",
    "Wrong scope",
  ];

  const handleSubmit = async () => {
    if (isReject && !reasonValid) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onConfirm({ mode, task, reason, remarks });
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
        {/* Brand strip */}
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
                {isReject ? "Reject submission" : "Approve submission"}
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                {isReject
                  ? "Send back to employee for rework"
                  : "Mark this task as completed"}
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
          <p className="text-[13.5px] font-semibold text-slate-800 mt-0.5">
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white text-[8px] font-semibold flex items-center justify-center">
              {getInitials(task.employee)}
            </div>
            <span>{task.employee}</span>
            <span>·</span>
            <span>Submitted {timeAgo(task.submittedAt)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[50vh] overflow-y-auto">
          {/* Employee note */}
          <div>
            <p className="pas-label">Employee's note</p>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px] text-slate-700 italic leading-relaxed">
              "{task.submittedNote}"
            </div>
            {task.attachments > 0 && (
              <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {task.attachments} attachment{task.attachments !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {isReject ? (
            <div>
              <label htmlFor="reject-reason" className="pas-label">
                Reason for rejection <span className="text-rose-500">*</span>
              </label>

              {/* Quick-pick chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {quickReasons.map((r) => (
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
                placeholder="Explain what needs to be fixed…"
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
            <div>
              <label htmlFor="approve-remarks" className="pas-label">
                Remarks{" "}
                <span className="text-slate-400 normal-case font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                id="approve-remarks"
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Any notes for the record…"
                className="pas-input resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="reset-btn" disabled={submitting}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || (isReject && !reasonValid)}
            className={`${isReject ? "delete-btn" : "submit-btn"} disabled:opacity-50`}
          >
            {isReject ? (
              <>
                <XCircle className="w-4 h-4" strokeWidth={2.2} />
                {submitting ? "Rejecting…" : "Reject"}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" strokeWidth={2.2} />
                {submitting ? "Approving…" : "Approve"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PAGE
   ============================================================ */
const ReviewQueue = () => {
  const [tasks, setTasks] = useState(MOCK_SUBMITTED);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [modal, setModal] = useState(null); // { mode, task }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.employee.toLowerCase().includes(q);
      return (
        matchSearch &&
        (!priorityFilter || t.priority === priorityFilter) &&
        (!employeeFilter || t.empId === employeeFilter)
      );
    });
  }, [tasks, search, priorityFilter, employeeFilter]);

  const stats = useMemo(() => {
    if (!tasks.length) return { pending: 0, oldest: 0, urgent: 0 };
    const oldest = tasks.reduce(
      (max, t) => Math.max(max, waitHours(t.submittedAt)),
      0,
    );
    const urgent = tasks.filter((t) => t.priority === "High").length;
    return { pending: tasks.length, oldest, urgent };
  }, [tasks]);

  const handleConfirm = ({ mode, task }) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setModal(null);
    if (mode === "approve") {
      toast.success(`${task.id} approved and marked completed`);
    } else {
      toast.success(`${task.id} sent back to ${task.employee}`);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setPriorityFilter("");
    setEmployeeFilter("");
  };
  const hasActiveFilter = search || priorityFilter || employeeFilter;

  return (
    <Layout
      title="Review Queue"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Review Queue",
      }}
    >
      <div className="space-y-4">
        {/* ============================================================
            STATS STRIP — 3 quick pills (pending, oldest, urgent)
           ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 ring-1 ring-amber-200">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]">
              <Send className="w-4 h-4" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-amber-700">
                Pending Review
              </p>
              <p className="text-[22px] font-bold leading-none text-amber-800 mt-0.5">
                {stats.pending}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 ring-1 ring-rose-200">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]">
              <Clock className="w-4 h-4" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-rose-700">
                Oldest Waiting
              </p>
              <p className="text-[22px] font-bold leading-none text-rose-800 mt-0.5">
                {stats.oldest < 24
                  ? `${stats.oldest}h`
                  : `${Math.floor(stats.oldest / 24)}d`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-sky-50 ring-1 ring-sky-200">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]">
              <Sparkles className="w-4 h-4" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-sky-700">
                High Priority
              </p>
              <p className="text-[22px] font-bold leading-none text-sky-800 mt-0.5">
                {stats.urgent}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            FILTER ROW — search + employee + priority + clear
           ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task ID, title, or employee…"
              className="pas-input"
              style={{paddingLeft: "35px"}}
            />
          </div>

          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="pas-input"
          >
            <option value="">All employees</option>
            {EMPLOYEES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="pas-input"
          >
            <option value="">All priorities</option>
            {Object.keys(priorityStyles).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className={`btn-ghost justify-center ${hasActiveFilter ? "" : "md:invisible"}`}
          >
            Clear
          </button>
        </div>

        {/* ============================================================
            LIST — cards, not a table (each item is a decision)
           ============================================================ */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/40">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2
                className="w-8 h-8 text-emerald-600"
                strokeWidth={2}
              />
            </div>
            <p className="text-[15px] font-semibold text-slate-800">
              {tasks.length === 0
                ? "All caught up! 🎉"
                : "No tasks match your filters"}
            </p>
            <p className="text-[12px] text-slate-500 mt-1 text-center max-w-sm">
              {tasks.length === 0
                ? "There are no submissions waiting for your review right now."
                : "Try clearing filters or changing the search."}
            </p>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="btn-ghost mt-4 text-emerald-600 hover:bg-emerald-50"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((task) => {
              const waited = waitHours(task.submittedAt);
              const waitLevel =
                waited >= 48 ? "urgent" : waited >= 24 ? "warn" : "fresh";
              const waitStyles = {
                fresh: {
                  chip: "bg-slate-100 text-slate-600 ring-slate-200",
                  dot: "bg-slate-400",
                },
                warn: {
                  chip: "bg-amber-50 text-amber-700 ring-amber-200",
                  dot: "bg-amber-500",
                },
                urgent: {
                  chip: "bg-rose-50 text-rose-700 ring-rose-200",
                  dot: "bg-rose-500",
                },
              }[waitLevel];

              return (
                <div
                  key={task.id}
                  className="group p-4 rounded-xl bg-white ring-1 ring-slate-200
                    hover:ring-emerald-200 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]
                    transition-all duration-150"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10.5px] font-mono font-semibold text-slate-400">
                          {task.id}
                        </span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded ring-1 ${priorityStyles[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded ring-1 ${waitStyles.chip}`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${waitStyles.dot}`}
                          />
                          {timeAgo(task.submittedAt)}
                        </span>
                      </div>

                      <p
                        className="text-[14px] font-semibold text-slate-800 truncate"
                        title={task.title}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[11.5px] text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 text-white text-[9px] font-semibold flex items-center justify-center">
                            {getInitials(task.employee)}
                          </div>
                          <span>{task.employee}</span>
                        </div>
                        <span className="text-slate-300">·</span>
                        <span>{task.type}</span>
                        <span className="text-slate-300">·</span>
                        <span>Due {formatDate(task.due)}</span>
                        {task.attachments > 0 && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="inline-flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {task.attachments}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="mt-2 text-[11.5px] text-slate-600 italic line-clamp-2">
                        "{task.submittedNote}"
                      </p>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 md:flex-col md:items-stretch md:w-32 flex-shrink-0">
                      <button
                        onClick={() => setModal({ mode: "approve", task })}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                          text-[12px] font-semibold text-emerald-700 bg-emerald-50
                          ring-1 ring-emerald-200
                          hover:bg-emerald-100 hover:ring-emerald-300
                          active:scale-[0.98] transition-all duration-150"
                      >
                        <CheckCircle2
                          className="w-3.5 h-3.5"
                          strokeWidth={2.4}
                        />
                        Approve
                      </button>
                      <button
                        onClick={() => setModal({ mode: "reject", task })}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                          text-[12px] font-semibold text-rose-700 bg-rose-50
                          ring-1 ring-rose-200
                          hover:bg-rose-100 hover:ring-rose-300
                          active:scale-[0.98] transition-all duration-150"
                      >
                        <XCircle className="w-3.5 h-3.5" strokeWidth={2.4} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            of {MOCK_SUBMITTED.length} submissions
            {hasActiveFilter && (
              <span className="ml-1 text-slate-400">· filtered</span>
            )}
          </p>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-100 disabled:opacity-40"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold">
              1
            </span>
            <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ReviewModal
          mode={modal.mode}
          task={modal.task}
          onClose={() => setModal(null)}
          onConfirm={handleConfirm}
        />
      )}
    </Layout>
  );
};

export default ReviewQueue;
