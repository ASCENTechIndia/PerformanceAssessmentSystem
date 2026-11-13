import { useState, useMemo } from "react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import MyTaskStats from "./MyTaskStats";
import MyTaskFilters from "./MyTaskFilters";
import MyTaskTabs from "./MyTaskTabs";
import MyTaskTable from "./MyTaskTable";

/* ---------- Dummy data ---------- */
const MOCK_TASKS = [
  {
    id: "AST-001",
    title: "Inspect drainage line, Ward 14",
    assignedBy: "Rajesh Kulkarni",
    assignedOn: "2026-11-12",
    dueDate: "2026-11-15",
    taskType: "Inspection",
    priority: "High",
    status: "New",
  },
  {
    id: "AST-002",
    title: "Verify vendor compliance docs",
    assignedBy: "Shri Kumar",
    assignedOn: "2026-11-10",
    dueDate: "2026-11-20",
    taskType: "Audit",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: "AST-003",
    title: "Update safety checklist",
    assignedBy: "Sneha Iyer",
    assignedOn: "2026-11-08",
    dueDate: "2026-11-13",
    taskType: "Review",
    priority: "Critical",
    status: "Rework",
  },
  {
    id: "AST-004",
    title: "Fire extinguisher inspection",
    assignedBy: "Rajesh Kulkarni",
    assignedOn: "2026-11-01",
    dueDate: "2026-11-10",
    taskType: "Inspection",
    priority: "High",
    status: "Submitted",
  },
  {
    id: "AST-005",
    title: "Monthly attendance report",
    assignedBy: "Shri Kumar",
    assignedOn: "2026-10-25",
    dueDate: "2026-11-01",
    taskType: "Report",
    priority: "Low",
    status: "Completed",
  },
  {
    id: "AST-006",
    title: "Water pump maintenance check",
    assignedBy: "Sneha Iyer",
    assignedOn: "2026-11-11",
    dueDate: "2026-11-18",
    taskType: "Inspection",
    priority: "Medium",
    status: "New",
  },
  {
    id: "AST-007",
    title: "Draft quarterly budget",
    assignedBy: "Rajesh Kulkarni",
    assignedOn: "2026-11-05",
    dueDate: "2026-11-25",
    taskType: "Report",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "AST-008",
    title: "Site visit - Construction Site 12",
    assignedBy: "Shri Kumar",
    assignedOn: "2026-11-09",
    dueDate: "2026-11-12",
    taskType: "Inspection",
    priority: "Critical",
    status: "Rework",
  },
  {
    id: "AST-009",
    title: "Audit HR onboarding process",
    assignedBy: "Sneha Iyer",
    assignedOn: "2026-10-30",
    dueDate: "2026-11-06",
    taskType: "Audit",
    priority: "Medium",
    status: "Completed",
  },
  {
    id: "AST-010",
    title: "Review vendor contracts",
    assignedBy: "Rajesh Kulkarni",
    assignedOn: "2026-11-12",
    dueDate: "2026-11-19",
    taskType: "Review",
    priority: "Low",
    status: "Submitted",
  },
];

const EMPTY_FILTERS = {
  search: "",
  taskType: "",
  priority: "",
  dueDate: "",
};

const MyTasks = () => {
  const [tasks] = useState(MOCK_TASKS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeTab, setActiveTab] = useState("open");

  /* Filter Logic */
  const filteredByFilters = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q);
      const matchType = !filters.taskType || t.taskType === filters.taskType;
      const matchPriority =
        !filters.priority || t.priority === filters.priority;

      // Basic Due Date mock logic
      const matchDueDate = !filters.dueDate || true;

      return matchSearch && matchType && matchPriority && matchDueDate;
    });
  }, [tasks, filters]);

  /* Tab Logic */
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case "open":
        return filteredByFilters.filter((t) =>
          ["New", "In Progress", "Rework"].includes(t.status),
        );
      case "new":
        return filteredByFilters.filter((t) => t.status === "New");
      case "in-progress":
        return filteredByFilters.filter((t) => t.status === "In Progress");
      case "rework":
        return filteredByFilters.filter((t) => t.status === "Rework");
      case "submitted":
        return filteredByFilters.filter((t) => t.status === "Submitted");
      case "completed":
        return filteredByFilters.filter((t) => t.status === "Completed");
      default:
        return filteredByFilters;
    }
  }, [filteredByFilters, activeTab]);

  /* Counts for Tabs (Based on filters) */
  const tabCounts = useMemo(
    () => ({
      open: filteredByFilters.filter((t) =>
        ["New", "In Progress", "Rework"].includes(t.status),
      ).length,
      new: filteredByFilters.filter((t) => t.status === "New").length,
      "in-progress": filteredByFilters.filter((t) => t.status === "In Progress")
        .length,
      rework: filteredByFilters.filter((t) => t.status === "Rework").length,
      submitted: filteredByFilters.filter((t) => t.status === "Submitted")
        .length,
      completed: filteredByFilters.filter((t) => t.status === "Completed")
        .length,
    }),
    [filteredByFilters],
  );

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const handleAction = (actionType, task) => {
    toast.info(`${actionType} action triggered for ${task.id}`);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

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
        <MyTaskStats tasks={tasks} />

        <MyTaskFilters
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
        />

        <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
          <MyTaskTabs
            counts={tabCounts}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <MyTaskTable tasks={filteredByTab} onAction={handleAction} />
        </div>

        <p className="text-[11.5px] text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredByTab.length}
          </span>{" "}
          of {tasks.length} tasks
          {hasActiveFilters && (
            <span className="ml-1 text-slate-400">· filtered</span>
          )}
        </p>
      </div>
    </Layout>
  );
};

export default MyTasks;
