import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  RefreshCw,
  CalendarClock,
  Trash2,
  Inbox,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  Clock,
  Send,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../../Components/Layout";

/* ---------- Dummy data (unchanged) ---------- */
const MOCK_TASKS = [
  {
    id: "T-101",
    title: "Safety Inspection – Zone A",
    employee: "Ravi Sharma",
    empId: "e101",
    type: "Inspection",
    priority: "High",
    due: "2026-11-12",
    status: "Assigned",
    assigned: "2026-11-04",
  },
  {
    id: "T-102",
    title: "Vendor Document Audit",
    employee: "Priya Menon",
    empId: "e102",
    type: "Audit",
    priority: "Medium",
    due: "2026-11-15",
    status: "In Progress",
    assigned: "2026-11-02",
  },
  {
    id: "T-103",
    title: "Monthly Attendance Review",
    employee: "Amit Patel",
    empId: "e103",
    type: "Review",
    priority: "Low",
    due: "2026-11-08",
    status: "Submitted",
    assigned: "2026-10-28",
  },
  {
    id: "T-104",
    title: "Fire Extinguisher Check – Ward 3",
    employee: "Sneha Iyer",
    empId: "e104",
    type: "Inspection",
    priority: "High",
    due: "2026-11-05",
    status: "Completed",
    assigned: "2026-10-25",
  },
  {
    id: "T-105",
    title: "Vendor Compliance Report",
    employee: "Ravi Sharma",
    empId: "e101",
    type: "Report",
    priority: "Medium",
    due: "2026-11-20",
    status: "In Progress",
    assigned: "2026-11-01",
  },
  {
    id: "T-106",
    title: "Site Visit – Construction Site 12",
    employee: "Priya Menon",
    empId: "e102",
    type: "Inspection",
    priority: "High",
    due: "2026-11-10",
    status: "Rejected",
    assigned: "2026-10-30",
  },
  {
    id: "T-107",
    title: "Quarterly Budget Review",
    employee: "Amit Patel",
    empId: "e103",
    type: "Review",
    priority: "Medium",
    due: "2026-11-22",
    status: "Assigned",
    assigned: "2026-11-04",
  },
  {
    id: "T-108",
    title: "Departmental Audit Prep",
    employee: "Sneha Iyer",
    empId: "e104",
    type: "Audit",
    priority: "Low",
    due: "2026-11-28",
    status: "In Progress",
    assigned: "2026-10-31",
  },
  {
    id: "T-109",
    title: "Equipment Maintenance Log",
    employee: "Ravi Sharma",
    empId: "e101",
    type: "Report",
    priority: "Medium",
    due: "2026-11-14",
    status: "Submitted",
    assigned: "2026-10-29",
  },
  {
    id: "T-110",
    title: "Vendor Onboarding Checklist",
    employee: "Amit Patel",
    empId: "e103",
    type: "Review",
    priority: "Low",
    due: "2026-11-06",
    status: "Completed",
    assigned: "2026-10-27",
  },
];

const EMPLOYEES = [
  { id: "e101", name: "Ravi Sharma" },
  { id: "e102", name: "Priya Menon" },
  { id: "e103", name: "Amit Patel" },
  { id: "e104", name: "Sneha Iyer" },
];

/* ---------- Style maps (unchanged) ---------- */
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

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const daysUntil = (iso) => Math.ceil((new Date(iso) - new Date()) / 86_400_000);

/* ---------- Row action menu (unchanged) ---------- */
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

  const canReassign = ["Assigned", "In Progress", "Rejected"].includes(
    task.status,
  );
  const canExtend = task.status !== "Completed";
  const canDelete = task.status === "Assigned";

  const items = [
    { key: "view", label: "View details", icon: Eye, show: true },
    { key: "reassign", label: "Reassign", icon: RefreshCw, show: canReassign },
    {
      key: "extend",
      label: "Extend deadline",
      icon: CalendarClock,
      show: canExtend,
    },
    {
      key: "delete",
      label: "Delete task",
      icon: Trash2,
      show: canDelete,
      danger: true,
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
              .map(({ key, label, icon: Icon, danger }) => (
                <button
                  key={key}
                  onClick={() => {
                    setOpen(false);
                    onAction(key, task);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-[12.5px] font-medium transition-colors
                  ${
                    danger
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

/* ============================================================
   🎨 STAT CARD — always colored, active state deeper
   ============================================================ */
const StatCard = ({ label, count, color, icon: Icon, active, onClick }) => {
  const palette = {
    slate: {
      soft: "bg-slate-50",
      text: "text-slate-700",
      ring: "ring-slate-200",
      ringActive: "ring-slate-300",
      grad: "from-slate-400 to-slate-500",
      dot: "bg-slate-500",
    },
    sky: {
      soft: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
      ringActive: "ring-sky-300",
      grad: "from-sky-400 to-blue-500",
      dot: "bg-sky-500",
    },
    amber: {
      soft: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      ringActive: "ring-amber-300",
      grad: "from-amber-400 to-orange-500",
      dot: "bg-amber-500",
    },
    rose: {
      soft: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      ringActive: "ring-rose-300",
      grad: "from-rose-400 to-pink-500",
      dot: "bg-rose-500",
    },
    emerald: {
      soft: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      ringActive: "ring-emerald-300",
      grad: "from-emerald-400 to-teal-500",
      dot: "bg-emerald-500",
    },

    /* 🔽 NEW — for All + Assigned */
    indigo: {
      soft: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
      ringActive: "ring-indigo-300",
      grad: "from-indigo-400 to-blue-600",
      dot: "bg-indigo-500",
    },
    violet: {
      soft: "bg-violet-50",
      text: "text-violet-700",
      ring: "ring-violet-200",
      ringActive: "ring-violet-300",
      grad: "from-violet-400 to-purple-500",
      dot: "bg-violet-500",
    },
  };
  const p = palette[color];

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden flex flex-col items-stretch p-3.5 rounded-xl text-left
        ${p.soft} ${active ? p.ringActive : p.ring}
        ring-1 transition-all duration-200
        ${
          active
            ? "shadow-[0_6px_16px_-6px_rgba(15,23,42,0.15)]"
            : "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(15,23,42,0.12)]"
        }`}
    >
      {/* Icon + pulse dot */}
      <div className="relative flex items-start justify-between mb-2.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center
          bg-gradient-to-br ${p.grad} text-white shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]`}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
        </div>
        {active && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${p.dot} animate-pulse
            shadow-[0_0_0_3px_rgba(255,255,255,0.9)]`}
          />
        )}
      </div>

      {/* Label */}
      <p
        className={`relative text-[10.5px] font-semibold uppercase tracking-wider ${p.text}`}
      >
        {label}
      </p>

      {/* Number */}
      <p
        className={`relative mt-0.5 text-[24px] font-bold leading-none tracking-tight ${p.text}`}
      >
        {count}
      </p>

      {/* Bottom accent line — always visible, brighter on hover, full on active */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${p.grad}
        transition-opacity duration-200
        ${active ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}
      />
    </button>
  );
};

/* ============================================================
   PAGE
   ============================================================ */
const TeamTasks = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  const counts = useMemo(
    () => ({
      all: MOCK_TASKS.length,
      Assigned: MOCK_TASKS.filter((t) => t.status === "Assigned").length,
      "In Progress": MOCK_TASKS.filter((t) => t.status === "In Progress")
        .length,
      Submitted: MOCK_TASKS.filter((t) => t.status === "Submitted").length,
      Rejected: MOCK_TASKS.filter((t) => t.status === "Rejected").length,
      Completed: MOCK_TASKS.filter((t) => t.status === "Completed").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_TASKS.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.employee.toLowerCase().includes(q);
      return (
        matchSearch &&
        (!statusFilter || t.status === statusFilter) &&
        (!priorityFilter || t.priority === priorityFilter) &&
        (!employeeFilter || t.empId === employeeFilter)
      );
    });
  }, [search, statusFilter, priorityFilter, employeeFilter]);

  const handleAction = (action, task) => {
    if (action === "view") {
      toast.info(`Opening ${task.id}…`);
      return;
    }
    const labels = {
      reassign: "Reassign modal",
      extend: "Extend deadline modal",
      delete: "Delete confirmation",
    };
    toast.info(`${labels[action]} — coming next`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setEmployeeFilter("");
  };

  const hasActiveFilter =
    search || statusFilter || priorityFilter || employeeFilter;

  return (
    <Layout
      title="Team Tasks"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Team Tasks",
      }}
    >
      <div className="space-y-4">
        {/* ============================================================
            🎨 STAT CARDS — grid of 6, each with icon + number + accent
           ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <StatCard
            label="All"
            count={counts.all}
            color="indigo" // ← was "slate"
            icon={LayoutList}
            active={!statusFilter}
            onClick={() => setStatusFilter("")}
          />
          <StatCard
            label="Assigned"
            count={counts.Assigned}
            color="violet" // ← was "slate"
            icon={Inbox}
            active={statusFilter === "Assigned"}
            onClick={() => setStatusFilter("Assigned")}
          />
          <StatCard
            label="In Progress"
            count={counts["In Progress"]}
            color="sky"
            icon={Clock}
            active={statusFilter === "In Progress"}
            onClick={() => setStatusFilter("In Progress")}
          />
          <StatCard
            label="Submitted"
            count={counts.Submitted}
            color="amber"
            icon={Send}
            active={statusFilter === "Submitted"}
            onClick={() => setStatusFilter("Submitted")}
          />
          <StatCard
            label="Rejected"
            count={counts.Rejected}
            color="rose"
            icon={XCircle}
            active={statusFilter === "Rejected"}
            onClick={() => setStatusFilter("Rejected")}
          />
          <StatCard
            label="Completed"
            count={counts.Completed}
            color="emerald"
            icon={CheckCircle2}
            active={statusFilter === "Completed"}
            onClick={() => setStatusFilter("Completed")}
          />
        </div>

        {/* ============================================================
            🔍 FILTER ROW — one row on md+ using grid, no wrap
           ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task ID, title, or employee…"
              className="pas-input"
              style={{ paddingLeft: "35px" }}
            />
          </div>

          {/* Employee */}
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

          {/* Priority */}
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

          {/* Clear — always in DOM (invisible when no filter) to keep grid stable */}
          <button
            onClick={clearFilters}
            className={`btn-ghost justify-center  ${hasActiveFilter ? "" : "md:invisible"}`}
          >
            Clear
          </button>
        </div>

        {/* ============================================================
            TABLE
           ============================================================ */}
        <div className="rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Task
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Employee
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
                        Try clearing filters or changing the search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((task) => {
                    const days = daysUntil(task.due);
                    const dueColor =
                      task.status === "Completed"
                        ? "text-slate-400"
                        : days < 0
                          ? "text-rose-600 font-semibold"
                          : days <= 2
                            ? "text-amber-600 font-semibold"
                            : "text-slate-600";

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-[10.5px] font-mono font-semibold text-slate-400">
                              {task.id}
                            </span>
                            <span
                              className="text-[13px] font-medium text-slate-800 truncate max-w-[240px]"
                              title={task.title}
                            >
                              {task.title}
                            </span>
                            <span className="text-[10.5px] text-slate-500 mt-0.5">
                              {task.type}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                              {getInitials(task.employee)}
                            </div>
                            <span className="text-[12.5px] text-slate-700 truncate max-w-[120px]">
                              {task.employee}
                            </span>
                          </div>
                        </td>

                        <td className="hidden md:table-cell px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${priorityStyles[task.priority]}`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className={`text-[12.5px] ${dueColor}`}>
                              {formatDate(task.due)}
                            </span>
                            {task.status !== "Completed" && (
                              <span className={`text-[10.5px] ${dueColor}`}>
                                {days < 0
                                  ? `${Math.abs(days)}d overdue`
                                  : days === 0
                                    ? "Due today"
                                    : `in ${days}d`}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${statusStyles[task.status]}`}
                          >
                            {task.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <RowActions task={task} onAction={handleAction} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            of {MOCK_TASKS.length} tasks
            {hasActiveFilter && (
              <span className="ml-1 text-slate-400">· filtered</span>
            )}
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

export default TeamTasks;
