import { useState, useMemo } from "react";
import { toast } from "sonner";
import Layout from "../../Components/Layout";
import TaskListStats from "./TaskListStats";
import TaskListFilters from "./TaskListFilters";
import TaskTabs from "./TaskTabs";
import TaskListTable from "./TaskListTable";
import CreateTaskModal from "./CreateTaskModal";

/* ---------- Dummy data ---------- */
const MOCK_TASKS = [
  {
    id: "T-001",
    title: "Safety Inspection – Zone A",
    taskType: "Inspection",
    expectedDuration: 7,
    parent: null,
    hasSubTask: true,
    createdAt: "2026-11-01",
    assignedTo: "Ravi Sharma",
    active: true,
  },
  {
    id: "T-002",
    title: "Electrical Panel Check – Zone A",
    taskType: "Inspection",
    expectedDuration: 3,
    parent: "T-001",
    hasSubTask: false,
    createdAt: "2026-11-02",
    assignedTo: "Priya Menon",
    active: true,
  },
  {
    id: "T-003",
    title: "Fire Exit Clearance – Zone A",
    taskType: "Inspection",
    expectedDuration: 2,
    parent: "T-001",
    hasSubTask: false,
    createdAt: "2026-11-02",
    assignedTo: null,
    active: true,
  },
  {
    id: "T-004",
    title: "Vendor Document Audit",
    taskType: "Audit",
    expectedDuration: 10,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-11-03",
    assignedTo: "Ravi Sharma",
    active: true,
  },
  {
    id: "T-005",
    title: "Monthly Attendance Review",
    taskType: "Review",
    expectedDuration: 5,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-11-04",
    assignedTo: "Amit Patel",
    active: true,
  },
  {
    id: "T-006",
    title: "Fire Extinguisher Check – Ward 3",
    taskType: "Inspection",
    expectedDuration: 3,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-10-25",
    assignedTo: "Sneha Iyer",
    active: true,
  },
  {
    id: "T-007",
    title: "Vendor Compliance Report",
    taskType: "Report",
    expectedDuration: 7,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-11-01",
    assignedTo: null,
    active: true,
  },
  {
    id: "T-008",
    title: "Site Visit – Construction Site 12",
    taskType: "Site Visit",
    expectedDuration: 3,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-10-30",
    assignedTo: "Priya Menon",
    active: true,
  },
  {
    id: "T-009",
    title: "Quarterly Budget Review",
    taskType: "Review",
    expectedDuration: 5,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-11-04",
    assignedTo: null,
    active: true,
  },
  {
    id: "T-010",
    title: "Equipment Maintenance Log",
    taskType: "Report",
    expectedDuration: 7,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-10-29",
    assignedTo: "Ravi Sharma",
    active: true,
  },
  {
    id: "T-011",
    title: "Legacy Vendor Audit",
    taskType: "Audit",
    expectedDuration: 15,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-09-15",
    assignedTo: "Anita Desai",
    active: false,
  },
  {
    id: "T-012",
    title: "Old Safety Walkthrough",
    taskType: "Inspection",
    expectedDuration: 3,
    parent: null,
    hasSubTask: false,
    createdAt: "2026-08-20",
    assignedTo: null,
    active: false,
  },
];

const EMPTY_FILTERS = {
  search: "",
  taskType: "",
  parentTask: "",
  status: "",
};

/* ---------- Page ---------- */
const TaskList = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeTab, setActiveTab] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  /* Apply filters (before tab logic) */
  const filteredByFilters = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q);
      const matchType = !filters.taskType || t.taskType === filters.taskType;
      const matchParent =
        !filters.parentTask || t.parent === filters.parentTask;
      const matchStatus =
        !filters.status || (filters.status === "Active" ? t.active : !t.active);
      return matchSearch && matchType && matchParent && matchStatus;
    });
  }, [tasks, filters]);

  /* Apply tab logic on top of filters */
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case "not-assigned":
        return filteredByFilters.filter((t) => t.active && !t.assignedTo);
      case "assigned":
        return filteredByFilters.filter((t) => t.active && t.assignedTo);
      case "inactive":
        return filteredByFilters.filter((t) => !t.active);
      case "all":
      default:
        return filteredByFilters;
    }
  }, [filteredByFilters, activeTab]);

  /* Tab counts — computed from filter result so counts update live */
  const tabCounts = useMemo(
    () => ({
      all: filteredByFilters.length,
      "not-assigned": filteredByFilters.filter((t) => t.active && !t.assignedTo)
        .length,
      assigned: filteredByFilters.filter((t) => t.active && t.assignedTo)
        .length,
      inactive: filteredByFilters.filter((t) => !t.active).length,
    }),
    [filteredByFilters],
  );

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  /* Create task handler */
  const handleCreate = (data) => {
    const newTask = {
      id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
      title: data.title,
      taskType: data.taskType,
      expectedDuration: Number(data.expectedDuration),
      parent: data.parent || null,
      hasSubTask: data.hasSubTask,
      createdAt: data.createdAt.split("T")[0],
      assignedTo: null,
      active: data.active,
    };
    setTasks((prev) => [newTask, ...prev]);
    setCreateOpen(false);
    toast.success(`${data.title} created as ${newTask.id}`);
  };

  /* Assign — placeholder */
  const handleAssign = (task) => {
    toast.info(`Assign action for ${task.id} — wire up later`);
  };

  /* Dropdown options from data */
  const taskTypeOptions = useMemo(
    () => [...new Set(tasks.map((t) => t.taskType))].sort(),
    [tasks],
  );
  const parentTaskOptions = useMemo(
    () =>
      tasks
        .filter((t) => t.hasSubTask && t.active)
        .map((t) => ({ id: t.id, title: t.title })),
    [tasks],
  );

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <Layout
      title="Task List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Task List",
      }}
    >
      <div className="space-y-4">
        <TaskListStats tasks={tasks} />

        <TaskListFilters
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
          taskTypes={taskTypeOptions}
          parentTasks={parentTaskOptions}
          onCreate={() => setCreateOpen(true)}
        />

        <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
          <TaskTabs
            counts={tabCounts}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <TaskListTable tasks={filteredByTab} onAssign={handleAssign} />
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

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        parentTaskOptions={parentTaskOptions}
        createdBy="Shri Kumar"
        nextTaskId={`T-${String(tasks.length + 1).padStart(3, "0")}`}
      />
    </Layout>
  );
};

export default TaskList;
