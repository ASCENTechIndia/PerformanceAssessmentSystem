import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import TaskTypeStats from "./TaskTypeStats";
import TaskTypeFilters from "./TaskTypeFilters";
import TaskTypeTable from "./TaskTypeTable";
import ViewTaskTypeModal from "./ViewTaskTypeModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

/* ---------- Dummy data ---------- */
const MOCK_TASK_TYPES = [
  {
    id: 1,
    name: "Inspection",
    description: "Physical site inspection task with photographic evidence.",
    active: true,
    createdBy: "Shri Kumar",
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    name: "Audit",
    description: "Document and process audit against compliance standards.",
    active: true,
    createdBy: "Shri Kumar",
    createdAt: "2026-01-20",
  },
  {
    id: 3,
    name: "Review",
    description: "Periodic review of ongoing work and team performance.",
    active: true,
    createdBy: "Sneha Iyer",
    createdAt: "2026-02-03",
  },
  {
    id: 4,
    name: "Report",
    description: "Formal report submission with data and analysis.",
    active: true,
    createdBy: "Sneha Iyer",
    createdAt: "2026-02-10",
  },
  {
    id: 5,
    name: "Site Visit",
    description: "On-ground field visit with observation notes.",
    active: false,
    createdBy: "Ravi Sharma",
    createdAt: "2026-03-05",
  },
  {
    id: 6,
    name: "Vendor Assessment",
    description: "Vendor capability and compliance assessment.",
    active: true,
    createdBy: "Shri Kumar",
    createdAt: "2026-03-18",
  },
];

const EMPTY_FILTERS = { name: "", status: "" };

const TaskTypeMaster = () => {
  const navigate = useNavigate();
  const [taskTypes, setTaskTypes] = useState(MOCK_TASK_TYPES);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    return taskTypes.filter((t) => {
      const matchName =
        !filters.name ||
        t.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchStatus =
        !filters.status || (filters.status === "Active" ? t.active : !t.active);
      return matchName && matchStatus;
    });
  }, [taskTypes, filters]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const handleView = (taskType) => setViewing(taskType);
  const handleEdit = (taskType) =>
    navigate(`/master/task-type/edit/${taskType.id}`, { state: { taskType } });
  const handleDelete = (taskType) => setDeleting(taskType);

  const confirmDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setTaskTypes((prev) => prev.filter((t) => t.id !== deleting.id));
      toast.success(`${deleting.name} deleted`);
      setDeleting(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete task type");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <Layout
      title="Task Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Task Type Master",
      }}
    >
      <div className="space-y-4">
        <TaskTypeStats taskTypes={taskTypes} />

        <TaskTypeFilters
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
        />

        <TaskTypeTable
          taskTypes={filtered}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <p className="text-[11.5px] text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          of {taskTypes.length} task types
          {hasActiveFilters && (
            <span className="ml-1 text-slate-400">· filtered</span>
          )}
        </p>
      </div>

      <ViewTaskTypeModal
        open={!!viewing}
        taskType={viewing}
        onClose={() => setViewing(null)}
      />

      <DeleteConfirmModal
        open={!!deleting}
        taskType={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        deleting={isDeleting}
      />
    </Layout>
  );
};

export default TaskTypeMaster;
