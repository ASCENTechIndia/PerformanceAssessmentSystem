import { useState, useMemo } from "react";
import {
  Search,
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
import Layout from "../../../Components/Layout";
import StatCard from "./StatCard";
import RowActions from "./RowActions";
import ExtensionModal from "./ExtensionModal";
import FinishTaskModal from "./FinishTaskModal";
import RaiseQueryModal from "./RaiseQueryModal";
import RejectTaskModal from "./RejectTaskModal";
import ViewTaskModal from "./ViewTaskModal";

/* ---------- Dummy data ---------- */
const MOCK_TASKS = [
  {
    id: "T-101",
    title: "Safety Inspection – Zone A",
    type: "Inspection",
    priority: "High",
    due: "2026-11-12",
    status: "Assigned",
    assigned: "2026-11-04",
    // New fields
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-11-05",
    instructions:
      "Focus on electrical panels and fire exits. Carry the safety checklist. Coordinate with the site supervisor before entry.",
    completionCriteria:
      "All 24 checklist items verified. Photographic evidence for any non-compliance. Sign-off from site supervisor.",
    attachments: [],
  },
  {
    id: "T-102",
    title: "Vendor Document Audit",
    type: "Audit",
    priority: "Medium",
    due: "2026-11-15",
    status: "In Progress",
    assigned: "2026-11-02",
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-11-03",
    instructions:
      "Audit the last 6 months of vendor compliance documents. Flag any missing GST filings or expired contracts.",
    completionCriteria:
      "Audit report submitted with a per-vendor compliance score. All flagged items have a remediation note.",
    attachments: [
      {
        id: 1,
        name: "vendor-master-list.xlsx",
        size: 84224,
        url: "/files/vendor-master-list.xlsx",
      },
      {
        id: 2,
        name: "gst-filings-q3.pdf",
        size: 512000,
        url: "/files/gst-filings-q3.pdf",
      },
    ],
  },
  {
    id: "T-103",
    title: "Monthly Attendance Review",
    type: "Review",
    priority: "Low",
    due: "2026-11-08",
    status: "Submitted",
    assigned: "2026-10-28",
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-10-29",
    instructions:
      "Review October attendance for all 42 employees. Flag any pattern of irregular attendance or repeated leaves.",
    completionCriteria:
      "Attendance summary submitted with per-employee percentage. Flagged cases have supporting notes.",
    attachments: [
      {
        id: 3,
        name: "october-attendance.pdf",
        size: 312000,
        url: "/files/october-attendance.pdf",
      },
    ],
    submissionRemarks:
      "October attendance summary prepared. 3 employees flagged for irregular patterns — noted with dates and reasons. Report ready for review.",
    submittedOn: "2026-11-06",
  },
  {
    id: "T-104",
    title: "Fire Extinguisher Check – Ward 3",
    type: "Inspection",
    priority: "High",
    due: "2026-11-05",
    status: "Completed",
    assigned: "2026-10-25",
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-10-26",
    instructions:
      "Check all fire extinguishers in Ward 3. Verify pressure gauge, expiry date, and mounting bracket integrity.",
    completionCriteria:
      "All 18 extinguishers photographed with gauge readings. Any unit past expiry has been flagged for replacement.",
    attachments: [
      {
        id: 4,
        name: "fire-extinguisher-photos.zip",
        size: 4194304,
        url: "/files/fire-extinguisher-photos.zip",
      },
      {
        id: 5,
        name: "inspection-report.pdf",
        size: 198656,
        url: "/files/fire-inspection-report.pdf",
      },
    ],
    submissionRemarks:
      "All 18 extinguishers checked. 2 units in basement past expiry — flagged for immediate replacement. Full photo evidence attached.",
    submittedOn: "2026-11-04",
  },
  {
    id: "T-105",
    title: "Vendor Compliance Report",
    type: "Report",
    priority: "Medium",
    due: "2026-11-20",
    status: "In Progress",
    assigned: "2026-11-01",
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-11-02",
    instructions:
      "Compile compliance status for all active vendors. Include contract renewals due in the next 90 days.",
    completionCriteria:
      "Report covers all active vendors with status (compliant / at-risk / non-compliant). Renewal calendar included.",
    attachments: [
      {
        id: 6,
        name: "vendor-contracts-2026.pdf",
        size: 786432,
        url: "/files/vendor-contracts-2026.pdf",
      },
    ],
  },
  {
    id: "T-106",
    title: "Site Visit – Construction Site 12",
    type: "Inspection",
    priority: "High",
    due: "2026-11-10",
    status: "Rejected",
    assigned: "2026-10-30",
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-10-31",
    instructions:
      "Visit Site 12 and document progress against the approved plan. Photograph all safety violations.",
    completionCriteria:
      "Progress report submitted with before/after photos. Any safety violations documented with corrective action notes.",
    attachments: [
      {
        id: 7,
        name: "site12-progress.pdf",
        size: 425984,
        url: "/files/site12-progress.pdf",
      },
    ],
    rejectionReason:
      "Section 3 missing inspection of the basement pump room. The safety audit was incomplete — please revisit and resubmit with all sections covered.",
    rejectedBy: "Shri Kumar",
    rejectedOn: "2026-11-07",
  },
  {
    id: "T-107",
    title: "Quarterly Budget Review",
    type: "Review",
    priority: "Medium",
    due: "2026-11-22",
    status: "Assigned",
    assigned: "2026-11-04",
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-11-05",
    instructions:
      "Review Q3 budget vs actuals for the IT department. Highlight any line items exceeding 15% variance.",
    completionCriteria:
      "Review submitted with variance analysis per category. Justifications included for any overruns over 15%.",
    attachments: [],
  },
  {
    id: "T-109",
    title: "Equipment Maintenance Log",
    type: "Report",
    priority: "Medium",
    due: "2026-11-14",
    status: "Submitted",
    assigned: "2026-10-29",
    assignedTo: "Ravi Sharma",
    assignedBy: "Shri Kumar",
    expectedStart: "2026-10-30",
    instructions:
      "Update the maintenance log for all equipment in Zone A. Note the next service dates and any units due for replacement.",
    completionCriteria:
      "Log updated for all Zone A equipment. Next-service dates filled for every unit. Replacement recommendations documented.",
    attachments: [
      {
        id: 8,
        name: "equipment-log-october.pdf",
        size: 245760,
        url: "/files/equipment-log-october.pdf",
      },
      {
        id: 9,
        name: "zone-a-photos.jpg",
        size: 1258291,
        url: "/files/zone-a-photos.jpg",
      },
    ],
    submissionRemarks:
      "Log updated for all Zone A equipment. 2 units (compressor, HVAC) need replacement within 60 days — noted with cost estimates in the report.",
    submittedOn: "2026-11-05",
  },
];

/* ---------- Task Type → rules map (dummy bridge until API) ---------- */
const TASK_TYPE_RULES = {
  Inspection: { docsMandatory: true },
  Audit: { docsMandatory: true },
  Review: { docsMandatory: false },
  Report: { docsMandatory: false },
};

/* ---------- Style maps ---------- */
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

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const daysUntil = (iso) => Math.ceil((new Date(iso) - new Date()) / 86_400_000);

/* ---------- Page ---------- */
const MyTasks = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  /* Modal state — one per action */
  const [extensionTask, setExtensionTask] = useState(null);
  const [finishTask, setFinishTask] = useState(null);
  const [queryTask, setQueryTask] = useState(null);
  const [rejectTask, setRejectTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);

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
        t.title.toLowerCase().includes(q);
      return (
        matchSearch &&
        (!statusFilter || t.status === statusFilter) &&
        (!priorityFilter || t.priority === priorityFilter)
      );
    });
  }, [search, statusFilter, priorityFilter]);

  /* ---------- Action router ---------- */
  const handleAction = (action, task) => {
    switch (action) {
      case "view":
        setViewTask(task);
        return;
      case "start":
        toast.success(`${task.id} moved to In Progress`);
        return;
      case "finish":
        setFinishTask(task);
        return;
      case "query":
        setQueryTask(task);
        return;
      case "extend":
        setExtensionTask(task);
        return;
      case "reject":
        setRejectTask(task);
        return;
      default:
        toast.info("Action coming soon");
    }
  };

  /* ---------- Submit handlers ---------- */
  const handleExtensionSubmit = ({ extraDays, reason }) => {
    toast.success(
      `Extension request submitted — ${extraDays} extra day${extraDays !== 1 ? "s" : ""} requested`,
    );
    console.log("Extension →", {
      taskId: extensionTask?.id,
      extraDays,
      reason,
    });
    setExtensionTask(null);
  };

  const handleFinishSubmit = ({ remarks, file }) => {
    toast.success(`${finishTask.id} submitted for review`);
    console.log("Finish →", {
      taskId: finishTask.id,
      remarks,
      file: file?.name,
    });
    setFinishTask(null);
  };

  const handleQuerySubmit = ({ question, file }) => {
    toast.success(`Query sent to HOD for ${queryTask.id}`);
    console.log("Query →", {
      taskId: queryTask.id,
      question,
      file: file?.name,
    });
    setQueryTask(null);
  };

  const handleRejectSubmit = ({ reason, details }) => {
    toast.success(`${rejectTask.id} returned to HOD`);
    console.log("Reject →", { taskId: rejectTask.id, reason, details });
    setRejectTask(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
  };
  const hasActiveFilter = search || statusFilter || priorityFilter;

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
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <StatCard
            label="All"
            count={counts.all}
            color="indigo"
            icon={LayoutList}
            active={!statusFilter}
            onClick={() => setStatusFilter("")}
          />
          <StatCard
            label="Assigned"
            count={counts.Assigned}
            color="violet"
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

        {/* Filter row */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_150px_auto] gap-3 md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task ID or title…"
              className="pas-input"
              style={{ paddingLeft: "35px" }}
            />
          </div>

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

        {/* Table */}
        <div className="rounded-xl border border-slate-200">
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

                        <td className="hidden md:table-cell px-4 py-3 text-[12.5px] text-slate-600">
                          {task.type}
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

      {/* ===================== Modals ===================== */}
      <ViewTaskModal
        open={!!viewTask}
        task={viewTask}
        onClose={() => setViewTask(null)}
      />

      <ExtensionModal
        open={!!extensionTask}
        task={extensionTask}
        onClose={() => setExtensionTask(null)}
        onSubmit={handleExtensionSubmit}
      />

      <FinishTaskModal
        open={!!finishTask}
        task={finishTask}
        docsMandatory={
          finishTask
            ? (TASK_TYPE_RULES[finishTask.type]?.docsMandatory ?? false)
            : false
        }
        onClose={() => setFinishTask(null)}
        onSubmit={handleFinishSubmit}
      />

      <RaiseQueryModal
        open={!!queryTask}
        task={queryTask}
        onClose={() => setQueryTask(null)}
        onSubmit={handleQuerySubmit}
      />

      <RejectTaskModal
        open={!!rejectTask}
        task={rejectTask}
        onClose={() => setRejectTask(null)}
        onSubmit={handleRejectSubmit}
      />
    </Layout>
  );
};

export default MyTasks;
