import { useState, useEffect } from "react";
import { Inbox, Search, ClipboardList, Eye, Activity } from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import apiClient from "../../../../apiClient";
import { useLoader } from "../../../Context/LoaderContext";
import TaskHistoryModal from "./TaskHistoryModal";
import TaskHierarchyModal from "./TaskHierarchyModal";
import { useAuth } from "../../../Context/AuthContext";

const TaskStatus2 = () => {
  const { setLoading } = useLoader();
  const {user} = useAuth()
  const userId =user?.userId
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  // State for the Progress History Modal and hierarchy modal
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedHierarchyId, setSelectedHierarchyId] = useState(null);

  useEffect(() => {
    const fetchTaskAssignList = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/getTaskAssignList?userId=${userId}`);
        if (response.success && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load assigned tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAssignList();
  }, [setLoading]);

  const filteredTasks = tasks.filter((task) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      String(task.TASK_ID).toLowerCase().includes(q) ||
      String(task.TASK_TITLE).toLowerCase().includes(q)
    );
  });

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Layout
      title="Assigned Tasks"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Assigned Tasks",
      }}
    >
      <div className="space-y-4">
        <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Task ID or Title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pas-input"
                style={{ paddingLeft: "35px" }}
              />
            </div>
            <span className="text-xs text-slate-500 ml-auto">
              {filteredTasks.length} of {tasks.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-24">
                    Task ID
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Task Title
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Expected Days
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Assigned Date
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Inbox className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-[13px] font-semibold text-slate-700">
                        No tasks found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.TASK_ID}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-semibold bg-slate-100 text-slate-600 rounded">
                          {task.TASK_ID}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-slate-400" />
                          <span
                            className="text-[13px] font-medium text-slate-800 truncate max-w-[300px]"
                            title={task.TASK_TITLE}
                          >
                            {task.TASK_TITLE}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="text-[12px] font-semibold text-slate-600">
                          {task.EXCEPCTEDDAYS} days
                        </span>
                      </td>

                      <td className="px-4 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                        {formatDate(task.INSDT)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm"
                          style={{
                            backgroundColor: task.BGCOLOR || "#e2e8f0",
                            color: task.FORECOLOR || "#334155",
                          }}
                        >
                          {task.STATUSNAME}
                        </span>
                      </td>

                      {/* NEW ACTION COLUMN */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTaskId(task.TASK_ID)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold text-blue-700 bg-blue-50 ring-1 ring-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>

                          <button
                            onClick={() => setSelectedHierarchyId(task.TASK_ID)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 hover:bg-indigo-100 transition-colors"
                          >
                            <Activity className="w-3.5 h-3.5" /> View Hierarchy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Task History Modal (Popup) */}
      <TaskHistoryModal
        open={!!selectedTaskId}
        taskAssignedId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Task Hierarchy Modal */}
      <TaskHierarchyModal
        open={!!selectedHierarchyId}
        taskId={selectedHierarchyId}
        onClose={() => setSelectedHierarchyId(null)}
      />
    </Layout>
  );
};

export default TaskStatus2;
