import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import TaskListStats from "./TaskListStats";
import TaskListFilters from "./TaskListFilters";
import TaskTabs from "./TaskTabs";
import TaskListTable from "./TaskListTable";
import CreateTaskModal from "./CreateTaskModal";
import AssignTaskModal from "./AssignTaskModal";
import { useAuth } from "../../../Context/AuthContext";
import apiClient from "../../../../apiClient";
import { useLoader } from "../../../Context/LoaderContext";

const mapApiRow = (row) => ({
  id: row.TASK_ID || "",
  rawId: Number(row.TASK_ID),
  title: row.TASK_TITLE || "",
  expectedDuration: Number(row.EXCEPCTEDDAYS ?? 0),
  parent: row.PARENTID || "",
  createdAt: row.INSDT,
  active: String(row.ISACTIVE).toUpperCase() === "Y",
  taskType: null,
  assignedTo: null,
  hasSubTask: false,
  taskTypeCode: row.TASKTYPE || "", // <--- MAPPED TASKTYPE HERE
  bgColor: row.BGCOLOR || "",
  foreColor: row.FORECOLOR || "",
  statusName: row.STATUSNAME || "",
});

const EMPTY_FILTERS = {
  search: "",
  taskType: "",
  parentTask: "",
  status: "",
};

function formatDateToAPI(dateString) {
  if (!dateString) return;
  const [year, month, day] = dateString.split("-");
  const monthMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  return `${day}-${monthMap[month]}-${year}`;
}

const TaskList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbId = user?.ulbId;
  const deptId = user?.deptId;
  const { setLoading } = useLoader();

  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeTab, setActiveTab] = useState("my-task");
  const [assigningTask, setAssigningTask] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const fetchTasks = async () => {
    if (!userId) {
      alert("User Id is not set");
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/getTaskList?userId=${userId}`);
      if (res?.success && Array.isArray(res.data)) {
        const mapped = res.data.map(mapApiRow);
        setTasks(mapped);
      } else {
        setTasks([]);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to load tasks",
      );
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredByFilters = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        String(t.id).toLowerCase().includes(q) ||
        String(t.title).toLowerCase().includes(q);
      const matchType = !filters.taskType || t.taskType === filters.taskType;
      const matchParent =
        !filters.parentTask || t.parent === filters.parentTask;
      const matchStatus = !filters.status || filters.status === t.statusName;
      return matchSearch && matchType && matchParent && matchStatus;
    });
  }, [tasks, filters]);

  // --- UPDATED TAB FILTER LOGIC ---
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case "my-task":
        return filteredByFilters.filter((t) => t.taskTypeCode !== "C");
      case "assigned-by-me":
        return filteredByFilters.filter((t) => t.taskTypeCode !== "A");
      default:
        return filteredByFilters;
    }
  }, [filteredByFilters, activeTab]);

  // --- UPDATED TAB COUNTS LOGIC ---
  const tabCounts = useMemo(
    () => ({
      "my-task": filteredByFilters.filter((t) => t.taskTypeCode !== "C").length,
      "assigned-by-me": filteredByFilters.filter((t) => t.taskTypeCode !== "A")
        .length,
    }),
    [filteredByFilters],
  );

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const handleCreate = async (data) => {
    if (data.hasSubTask && !data.parent) {
      toast.error("Select parent task");
      return;
    }

    const newTask = {
      IN_MODE: 1,
      IN_TASK_ID: null,
      IN_TASKTYPE_ID: Number(data.taskType),
      IN_TASK_TITLE: data.title,
      IN_TASK_DESCRIPTION: data.description,
      IN_TASK_COMPLETIONCRITERIA: data.completionCriteria,
      IN_TASK_EXCEPCTEDDAYS: Number(data.expectedDuration),
      IN_TASK_PARENTID:
        data.parent === "" || data.parent == null ? 0 : Number(data.parent),
      IN_TASK_ISACTIVE: data.active ? "Y" : "N",
      IN_USERID: userId,
    };

    try {
      const response = await apiClient.post("/AOPT_TASK_INSUPD", newTask);

      if (response.success && Number(response.errorCode) === 9999) {
        toast.success(response.errorMessage || "Task created");
        setCreateOpen(false);
        fetchTasks();
      } else {
        toast.error(response.errorMessage || "Failed to create task");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create task",
      );
    }
  };

  const handleAssign = (task) => setAssigningTask(task);

  const handleAssignSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        IN_MODE: 1,
        IN_TASKASSIGNMENT_ID: null,
        IN_TASKID: Number(assigningTask.id),
        IN_DEPTID: Number(deptId),
        IN_ASSIGNEDBY: Number(userId),
        IN_ASSIGNEDTO: Number(data.assignedTo),
        IN_ASSIGNEDDATE: formatDateToAPI(today),
        IN_STARTDATE: formatDateToAPI(data.expectedStart),
        IN_DUEDATE: formatDateToAPI(data.expectedCompletion),
        IN_STATUSID: Number(data.status),
        IN_PRIORITY: data.priority,
        IN_FINISHEDDATE: null,
        IN_COMPLETEDDATE: null,
        IN_ISACTIVE: data.active ? "Y" : "N",
        IN_ACTIONREMARK: data.actionRemark || "",
        IN_USERID: userId,
      };

      const response = await apiClient.post(
        "/AOPT_TASKASSIGNMENT_INSUPD",
        payload,
      );

      if (response.success && response.errorCode === 9999) {
        toast.success(response.errorMessage || "Task assigned");
        setAssigningTask(null);
        fetchTasks();
      } else {
        toast.error(response.errorMessage || "Failed to assign task");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusDropdown = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/getStatusDropdown");

      if (response.success && Array.isArray(response.data)) {
        const formatted = response.data.map((item) => ({
          label: item.STATUSNAME,
          value: item.STATUSNAME,
        }));

        setStatusOptions(formatted);
      }
    } catch (err) {
      setStatusOptions([]);
      console.error(err);
      toast.error(err.message || "Failed to fetch Status dropdown options");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusDropdown();
  }, []);

  const taskTypeOptions = useMemo(
    () => [...new Set(tasks.map((t) => t.taskType).filter(Boolean))].sort(),
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
          statusOptions={statusOptions}
          onCreate={() => setCreateOpen(true)}
        />

        <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
          <TaskTabs
            counts={tabCounts}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {tasks?.length > 0 && (
            <TaskListTable
              tasks={filteredByTab}
              onAssign={handleAssign}
              allowAssign={activeTab === "my-task"}
            />
          )}
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
        createdBy="Shri Kumar"
        nextTaskId={`T-${String(tasks.length + 1).padStart(3, "0")}`}
      />
      <AssignTaskModal
        open={!!assigningTask}
        onClose={() => setAssigningTask(null)}
        task={assigningTask}
        onAssign={handleAssignSubmit}
      />
    </Layout>
  );
};

export default TaskList;
