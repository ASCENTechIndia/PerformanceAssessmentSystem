import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MoreVertical,
  Eye,
  MessageSquare,
  XCircle,
  Clock,
  CheckCircle2,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../../Components/Layout";

/* ---------- Demo data ---------- */
const MOCK_TASKS = [
  {
    id: "T-101",
    title: "Safety Inspection – Zone A",
    type: "Inspection",
    priority: "High",
    due: "2026-11-12",
    status: "In Progress",
  },
  {
    id: "T-102",
    title: "Vendor Document Audit",
    type: "Audit",
    priority: "Medium",
    due: "2026-11-15",
    status: "Pending",
  },
  {
    id: "T-103",
    title: "Monthly Attendance Review",
    type: "Review",
    priority: "Low",
    due: "2026-11-08",
    status: "Under Review",
  },
  {
    id: "T-104",
    title: "Fire Extinguisher Check – Ward 3",
    type: "Inspection",
    priority: "High",
    due: "2026-11-05",
    status: "Completed",
  },
  {
    id: "T-105",
    title: "Vendor Compliance Report",
    type: "Report",
    priority: "Medium",
    due: "2026-11-20",
    status: "In Progress",
  },
  {
    id: "T-106",
    title: "Site Visit – Construction Site 12",
    type: "Inspection",
    priority: "High",
    due: "2026-11-10",
    status: "Rejected",
  },
];

/* ---------- Style maps ---------- */
const statusStyles = {
  Pending: "bg-amber-50  text-amber-700  ring-amber-200",
  "In Progress": "bg-sky-50    text-sky-700    ring-sky-200",
  "Under Review": "bg-violet-50 text-violet-700 ring-violet-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-50   text-rose-700   ring-rose-200",
};

const priorityStyles = {
  High: "bg-rose-50  text-rose-700  ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-slate-50 text-slate-600  ring-slate-200",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ---------- Row action menu ---------- */
const RowActions = ({ task, onAction }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const canAct = ["Pending", "In Progress", "Under Review"].includes(
    task.status,
  );

  const items = [
    { key: "view", label: "View details", icon: Eye, show: true },
    { key: "query", label: "Raise query", icon: MessageSquare, show: canAct },
    { key: "reject", label: "Reject task", icon: XCircle, show: canAct },
    { key: "extend", label: "Request extension", icon: Clock, show: canAct },
    {
      key: "finish",
      label: "Mark as finished",
      icon: CheckCircle2,
      show: canAct,
    },
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Task actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-52 origin-top-right rounded-xl bg-white ring-1 ring-slate-200 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />
          <div className="p-1">
            {items
              .filter((i) => i.show)
              .map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setOpen(false);
                    onAction(key, task);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-[12.5px] font-medium transition-colors
                  ${
                    key === "reject"
                      ? "text-rose-600 hover:bg-rose-50"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <Icon
                    className="w-3.5 h-3.5 flex-shrink-0"
                    strokeWidth={2.2}
                  />
                  {label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Page ---------- */
const MyTask = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_TASKS.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q);
      return (
        matchSearch &&
        (!statusFilter || t.status === statusFilter) &&
        (!priorityFilter || t.priority === priorityFilter)
      );
    });
  }, [search, statusFilter, priorityFilter]);

  const handleAction = (action, task) => {
    // Wire these to actual modals in the next iteration
    if (action === "view") {
      toast.info(`Opening ${task.id}…`);
      // navigate(`/tasks/${task.id}`);   ← enable when detail page is built
      return;
    }
    const labels = {
      query: "Raise Query",
      reject: "Reject Task",
      extend: "Request Extension",
      finish: "Mark as Finished",
    };
    toast.info(`${labels[action]} — modal coming next`);
  };

  return (
    <Layout
      title="My Tasks"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "My Tasks",
      }}
    >
      <div className="space-y-4">
        {/* ---------- Filter bar ---------- */}
        <div className="grid grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by task ID or title…"
              className="pas-input"
              style={{paddingLeft: "35px"}}
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pas-input md:w-44"
          >
            <option value="">All statuses</option>
            {Object.keys(statusStyles).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="pas-input md:w-44"
          >
            <option value="">All priorities</option>
            {Object.keys(priorityStyles).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- Table ---------- */}
        <div className="rounded-xl border border-slate-200 overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Task
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Due
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Inbox className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-[13px] font-semibold text-slate-700">
                        No tasks match your filters
                      </p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">
                        Try clearing the search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Task */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-[10.5px] font-mono font-semibold text-slate-400">
                            {task.id}
                          </span>
                          <span
                            className="text-[13px] font-medium text-slate-800 truncate max-w-[280px]"
                            title={task.title}
                          >
                            {task.title}
                          </span>
                          <span className="md:hidden text-[10.5px] text-slate-500 mt-0.5">
                            {task.type} · {task.priority}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="hidden md:table-cell px-4 py-3 text-[12.5px] text-slate-600">
                        {task.type}
                      </td>

                      {/* Priority */}
                      <td className="hidden md:table-cell px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${priorityStyles[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      {/* Due */}
                      <td className="px-4 py-3 text-[12.5px] text-slate-600 whitespace-nowrap">
                        {formatDate(task.due)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${statusStyles[task.status]}`}
                        >
                          {task.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <RowActions task={task} onAction={handleAction} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            of {MOCK_TASKS.length} tasks
          </p>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
              1
            </span>
            <button className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyTask;
