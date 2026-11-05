import { useState, useMemo } from "react";
import { Search, Inbox, Clock, CalendarClock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import RequestCard from "./RequestCard";
import DecisionModal from "./DecisionModal";

/* ---------- Dummy data ---------- */
const now = Date.now();
const hoursAgo = (h) => new Date(now - h * 3_600_000).toISOString();

const MOCK_REQUESTS = [
  {
    id: "EXT-001",
    taskId: "T-102",
    taskTitle: "Vendor Document Audit",
    taskType: "Audit",
    employee: "Priya Menon",
    empId: "e102",
    currentDeadline: "2026-11-15",
    requestedExtraDays: 3,
    reason:
      "The vendor has not submitted two key compliance documents yet. Followed up twice but they need until Nov 18 to send them.",
    requestedAt: hoursAgo(6),
  },
  {
    id: "EXT-002",
    taskId: "T-105",
    taskTitle: "Vendor Compliance Report",
    taskType: "Report",
    employee: "Ravi Sharma",
    empId: "e101",
    currentDeadline: "2026-11-20",
    requestedExtraDays: 5,
    reason:
      "Waiting on approval from the legal team for two clauses. Their review typically takes 4-5 days.",
    requestedAt: hoursAgo(30),
  },
  {
    id: "EXT-003",
    taskId: "T-108",
    taskTitle: "Departmental Audit Prep",
    taskType: "Audit",
    employee: "Sneha Iyer",
    empId: "e104",
    currentDeadline: "2026-11-28",
    requestedExtraDays: 2,
    reason:
      "The audit checklist was extended by the headquarters. Need two more days to align with the new format.",
    requestedAt: hoursAgo(52),
  },
  {
    id: "EXT-004",
    taskId: "T-107",
    taskTitle: "Quarterly Budget Review",
    taskType: "Review",
    employee: "Amit Patel",
    empId: "e103",
    currentDeadline: "2026-11-22",
    requestedExtraDays: 4,
    reason:
      "Finance team is still reconciling Q3 data. I cannot complete the analysis without their final numbers.",
    requestedAt: hoursAgo(2),
  },
];

const EMPLOYEES = [
  { id: "e101", name: "Ravi Sharma" },
  { id: "e102", name: "Priya Menon" },
  { id: "e103", name: "Amit Patel" },
  { id: "e104", name: "Sneha Iyer" },
];

/* ---------- Stat pill ---------- */
const StatPill = ({ label, value, color, icon: Icon }) => {
  const palette = {
    amber: {
      bg: "bg-amber-50",
      ring: "ring-amber-200",
      text: "text-amber-800",
      grad: "from-amber-400 to-orange-500",
    },
    rose: {
      bg: "bg-rose-50",
      ring: "ring-rose-200",
      text: "text-rose-800",
      grad: "from-rose-400 to-pink-500",
    },
    sky: {
      bg: "bg-sky-50",
      ring: "ring-sky-200",
      text: "text-sky-800",
      grad: "from-sky-400 to-blue-500",
    },
  };
  const p = palette[color];

  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-xl ${p.bg} ring-1 ${p.ring}`}
    >
      <div
        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.grad} text-white
        flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]`}
      >
        <Icon className="w-4 h-4" strokeWidth={2.2} />
      </div>
      <div>
        <p
          className={`text-[10.5px] font-semibold uppercase tracking-wider ${p.text}`}
        >
          {label}
        </p>
        <p className={`text-[22px] font-bold leading-none mt-0.5 ${p.text}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

/* ---------- Page ---------- */
const ExtensionRequests = () => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [modal, setModal] = useState(null); // { mode, request }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.taskId.toLowerCase().includes(q) ||
        r.taskTitle.toLowerCase().includes(q) ||
        r.employee.toLowerCase().includes(q);
      return matchSearch && (!employeeFilter || r.empId === employeeFilter);
    });
  }, [requests, search, employeeFilter]);

  const stats = useMemo(() => {
    if (!requests.length) return { pending: 0, oldest: 0, avgDays: 0 };
    const oldest = requests.reduce(
      (max, r) =>
        Math.max(
          max,
          Math.floor(
            (Date.now() - new Date(r.requestedAt).getTime()) / 3_600_000,
          ),
        ),
      0,
    );
    const avgDays = Math.round(
      requests.reduce((sum, r) => sum + r.requestedExtraDays, 0) /
        requests.length,
    );
    return { pending: requests.length, oldest, avgDays };
  }, [requests]);

  const handleConfirm = ({ mode, request, reason }) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    setModal(null);
    if (mode === "approve") {
      toast.success(
        `${request.taskId} extended by ${request.requestedExtraDays} day${request.requestedExtraDays !== 1 ? "s" : ""}`,
      );
    } else {
      toast.success(
        `${request.taskId} extension rejected — ${request.employee} notified`,
      );
    }
    console.log("Extension decision →", { mode, request, reason });
  };

  const clearFilters = () => {
    setSearch("");
    setEmployeeFilter("");
  };
  const hasActiveFilter = search || employeeFilter;

  return (
    <Layout
      title="Extension Requests"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Extension Requests",
      }}
    >
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <StatPill
            label="Pending requests"
            value={stats.pending}
            color="amber"
            icon={Clock}
          />
          <StatPill
            label="Oldest waiting"
            value={
              stats.oldest < 24
                ? `${stats.oldest}h`
                : `${Math.floor(stats.oldest / 24)}d`
            }
            color="rose"
            icon={CalendarClock}
          />
          <StatPill
            label="Avg extra days"
            value={`${stats.avgDays}d`}
            color="sky"
            icon={TrendingUp}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request ID, task, or employee…"
              className="pas-input"
              style={{ paddingLeft: "35px" }}
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

          <button
            onClick={clearFilters}
            className={`btn-ghost justify-center ${hasActiveFilter ? "" : "md:invisible"}`}
          >
            Clear
          </button>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/40">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-emerald-600" strokeWidth={2} />
            </div>
            <p className="text-[15px] font-semibold text-slate-800">
              {requests.length === 0
                ? "No pending extension requests 🎉"
                : "No requests match your filters"}
            </p>
            <p className="text-[12px] text-slate-500 mt-1 text-center max-w-sm">
              {requests.length === 0
                ? "All extension requests have been handled."
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
            {filtered.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onApprove={(r) => setModal({ mode: "approve", request: r })}
                onReject={(r) => setModal({ mode: "reject", request: r })}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            of {MOCK_REQUESTS.length} requests
            {hasActiveFilter && (
              <span className="ml-1 text-slate-400">· filtered</span>
            )}
          </p>
        </div>
      </div>

      {/* Decision modal */}
      <DecisionModal
        open={!!modal}
        mode={modal?.mode}
        request={modal?.request}
        onClose={() => setModal(null)}
        onConfirm={handleConfirm}
      />
    </Layout>
  );
};

export default ExtensionRequests;
