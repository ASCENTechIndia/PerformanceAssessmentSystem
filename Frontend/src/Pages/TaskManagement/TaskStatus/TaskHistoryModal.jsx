import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <--- Import this
import {
  Search,
  Eye,
  Inbox,
  MessageSquare,
  X,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../../../../apiClient";
import TaskProgressModal from "./TaskProgressModal";

const TaskHistoryModal = ({ open, taskAssignedId, onClose }) => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProgress, setSelectedProgress] = useState(null);

  // Fetch list dynamically when modal opens
  useEffect(() => {
    if (!open || !taskAssignedId) return;

    const fetchTaskStatusList = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(
          `/getTaskStatusList?taskAssignedId=${taskAssignedId}`,
        );
        if (res.success && res.data) {
          setListData(res.data);
        } else {
          setListData([]);
        }
      } catch (err) {
        toast.error("Failed to load task progress");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStatusList();
  }, [open, taskAssignedId]);

  if (!open) return null;

  const filteredData = listData.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      String(item.TASKPROGRESS_ID).toLowerCase().includes(q) ||
      String(item.TASKASSIGNID).toLowerCase().includes(q)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Wrap the entire return in createPortal
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl ring-1 ring-slate-200 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Brand accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-slate-800">
                Task Progress History
              </h2>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Track all updates and submissions for Task #{taskAssignedId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-6 py-3 flex-shrink-0 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Progress ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pas-input bg-white"
              style={{ paddingLeft: "35px" }}
            />
          </div>
          <span className="text-xs text-slate-500 ml-auto">
            {filteredData.length} of {listData.length} updates
          </span>
        </div>

        {/* Table Area (Scrollable) */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Progress ID</th>
                  <th className="px-4 py-3 font-semibold">Action Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Remarks</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Attachments
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Loading history...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Inbox className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          No progress found
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          This task hasn't been updated yet.
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
                      <td className="px-4 py-3 font-mono text-[12px] font-semibold text-slate-600">
                        {item.TASKPROGRESS_ID}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-[12px] whitespace-nowrap">
                        {formatDate(item.ACTIONDATE)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold shadow-sm"
                          style={{
                            backgroundColor: item.BGCOLOR || "#e2e8f0",
                            color: item.FORECOLOR || "#334155",
                          }}
                        >
                          {item.STATUSNAME}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="flex items-center gap-1.5 text-slate-600 text-[12px] max-w-[200px] truncate"
                          title={item.ACTIONREMARK}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {item.ACTIONREMARK || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {/* Only show view button if there is an attachment */}
                        {item.ATTACHMENT_ID ? (
                          <button
                            onClick={() => setSelectedProgress(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold text-blue-700 bg-blue-50 ring-1 ring-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View File
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            No file
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Nested Attachment Modal */}
      <TaskProgressModal
        open={!!selectedProgress}
        data={selectedProgress}
        onClose={() => setSelectedProgress(null)}
      />
    </div>,
    document.body,
  );
};

export default TaskHistoryModal;
