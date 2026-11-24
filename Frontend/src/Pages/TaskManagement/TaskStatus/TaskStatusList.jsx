import { useState, useEffect } from "react";
import { Search, Eye, Inbox, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import TaskProgressModal from "./TaskProgressModal";
import apiClient from "../../../../apiClient"; // Adjust path if needed

const TaskStatusList = () => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProgress, setSelectedProgress] = useState(null);

  // Fetch list
  useEffect(() => {
    const fetchTaskStatusList = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/getTaskStatusList?taskAssignedId=41");
        if (res.success && res.data) {
          setListData(res.data);
        }
      } catch (err) {
        toast.error("Failed to load task progress");
      } finally {
        setLoading(false);
      }
    };
    fetchTaskStatusList();
  }, []);

  const filteredData = listData.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      String(item.TASKPROGRESS_ID).toLowerCase().includes(q) ||
      String(item.TASKASSIGNID).toLowerCase().includes(q)
    );
  });

  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout
      title="Task Progress Tracking"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Task Progress",
      }}
    >
      <div className="space-y-5">
        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Progress ID or Task Assign ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pas-input"
                style={{ paddingLeft: "35px" }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {filteredData.length} of {listData.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Progress ID</th>
                  <th className="px-4 py-3 font-semibold">Task Assign ID</th>
                  <th className="px-4 py-3 font-semibold">Action Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Remarks</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Loading task progress...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Inbox className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          No records found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.TASKPROGRESS_ID}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Progress ID */}
                      <td className="px-4 py-3 font-mono text-[12px] font-semibold text-slate-600">
                        PRG-{item.TASKPROGRESS_ID}
                      </td>

                      {/* Task Assign ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] text-slate-800">
                          ASG-{item.TASKASSIGNID}
                        </span>
                      </td>

                      {/* Action Date */}
                      <td className="px-4 py-3 text-slate-600 text-[12px] whitespace-nowrap">
                        {formatDate(item.ACTIONDATE)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold ring-1 bg-blue-50 text-blue-700 ring-blue-200">
                          {item.STATUSNAME}
                        </span>
                      </td>

                      {/* Remarks (Truncated) */}
                      <td className="px-4 py-3">
                        <div
                          className="flex items-center gap-1.5 text-slate-600 text-[12px] max-w-[250px] truncate"
                          title={item.ACTIONREMARK}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {item.ACTIONREMARK || "—"}
                        </div>
                      </td>

                      {/* View Action */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedProgress(item)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                            text-[11.5px] font-semibold text-blue-700 bg-blue-50 ring-1 ring-blue-200
                            hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Child Modal Component */}
      <TaskProgressModal
        open={!!selectedProgress}
        data={selectedProgress}
        onClose={() => setSelectedProgress(null)}
      />
    </Layout>
  );
};

export default TaskStatusList;
