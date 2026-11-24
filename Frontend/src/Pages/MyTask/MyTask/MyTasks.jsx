
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import MyTaskStats from "./MyTaskStats";
import MyTaskFilters from "./MyTaskFilters";
import MyTaskTabs from "./MyTaskTabs";
import MyTaskTable from "./MyTaskTable";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiClient from "../../../../apiClient";
import ViewTaskModal from "./ViewTaskModal";
import { useNavigate } from "react-router-dom";

const EMPTY_FILTERS = {
  search: "",
  status: "",
  priority: "",
};

const MyTasks = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const ulbId = user?.ulbId;
  const userId = user?.userId;
  const deptId = user?.deptId;

  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeTab, setActiveTab] = useState("open");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch tasks
  const fetchMyTasks = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        `/getMyTaskList?empId=90033`
      );

      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredByFilters = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchSearch =
        !q ||
        String(task.TASKASSIGNMENT_ID ?? "").toLowerCase().includes(q) ||
        String(task.TASK_TITLE ?? "").toLowerCase().includes(q);

      const matchStatus =
        !filters.status ||
        String(task.STATUSNAME) === String(filters.status);

      const matchPriority =
        !filters.priority ||
        String(task.PRIORITY ?? "").toLowerCase() ===
        filters.priority.toLowerCase();

      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, filters]);

  // Tab Logic
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case "open":
        return filteredByFilters.filter((task) =>
          ["New", "In Progress", "Rework", "Assigned"].includes(
            task.STATUSNAME
          )
        );

      case "new":
        return filteredByFilters.filter(
          (task) => task.STATUSNAME === "New"
        );

      case "in-progress":
        return filteredByFilters.filter(
          (task) => task.STATUSNAME === "In Progress"
        );

      case "rework":
        return filteredByFilters.filter(
          (task) => task.STATUSNAME === "Rework"
        );

      case "submitted":
        return filteredByFilters.filter(
          (task) => task.STATUSNAME === "Submitted"
        );

      case "completed":
        return filteredByFilters.filter(
          (task) => task.STATUSNAME === "Completed"
        );

      default:
        return filteredByFilters;
    }
  }, [filteredByFilters, activeTab]);

  // Counts for Tabs
  const tabCounts = useMemo(
    () => ({
      open: filteredByFilters.filter((task) =>
        ["New", "In Progress", "Rework", "Assigned"].includes(
          task.STATUSNAME
        )
      ).length,

      new: filteredByFilters.filter(
        (task) => task.STATUSNAME === "New"
      ).length,

      "in-progress": filteredByFilters.filter(
        (task) => task.STATUSNAME === "In Progress"
      ).length,

      rework: filteredByFilters.filter(
        (task) => task.STATUSNAME === "Rework"
      ).length,

      submitted: filteredByFilters.filter(
        (task) => task.STATUSNAME === "Submitted"
      ).length,

      completed: filteredByFilters.filter(
        (task) => task.STATUSNAME === "Completed"
      ).length,
    }),
    [filteredByFilters]
  );

  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const handleAction = (actionType, task) => {
    if (actionType === "View") {
      setSelectedTask(task);
      setShowViewModal(true);
    }

    if (actionType === "Edit") {
      console.log("Edit task:", task);
      navigate("/Task/task-status", {
        state: {
          task
        }
      })

    }
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== ""
  );

  useEffect(() => {
    fetchMyTasks();
  }, []);

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

          <MyTaskTable
            tasks={filteredByTab}
            onAction={handleAction}
          />
        </div>

        <p className="text-[11.5px] text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredByTab.length}
          </span>{" "}
          of {tasks.length} tasks
          {hasActiveFilters && (
            <span className="ml-1 text-slate-400">
              · filtered
            </span>
          )}
        </p>
      </div>

      {showViewModal && selectedTask && (
        <ViewTaskModal
          task={selectedTask}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </Layout>
  );
};

export default MyTasks;
