import { useState } from "react";
import { Search, Eye, Inbox, Paperclip } from "lucide-react";
import Layout from "../../../Components/Layout";
import TaskProgressModal from "./TaskProgressModal";

/* ============================================================
   DUMMY DATA (Simulating the API Response)
   ============================================================ */
const MOCK_PROGRESS_LIST = [
  {
    id: 1,
    progressId: "PRG-1024",
    taskAssignId: "ASG-20231",
    taskTitle: "Inspect drainage line, Ward 14",
    statusName: "Rework",
    statusColor: "bg-rose-50 text-rose-700 ring-rose-200",
    actionBy: "Rakesh Verma",
    actionDate: "24 Nov 2026, 10:30 AM",
    comment:
      "Photos for chambers C9 and C11 are missing geo-tags. Please re-upload with location data and add the chamber-wise cost split in the estimate.",
    fileName: "chamber_photos_C9.jpg",
    fileType: "image/jpeg",
    // Using a placeholder image for demo
    fileDoc:
      "https://images.unsplash.com/photo-1541888049876-3f6996825b28?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    progressId: "PRG-1023",
    taskAssignId: "ASG-20230",
    taskTitle: "Monthly safety audit report",
    statusName: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    actionBy: "Sneha Patil",
    actionDate: "23 Nov 2026, 04:15 PM",
    comment:
      "Audit completed successfully. All fire exits are clear. Two extinguishers were replaced. The full signed report is attached.",
    fileName: "safety_audit_report_nov.pdf",
    fileType: "application/pdf",
    fileDoc: "#", // Dummy link
  },
];

const TaskStatusList = () => {
  const [listData] = useState(MOCK_PROGRESS_LIST);
  const [search, setSearch] = useState("");
  const [selectedProgress, setSelectedProgress] = useState(null);

  // Filter logic
  const filteredData = listData.filter((item) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      item.taskAssignId.toLowerCase().includes(q) ||
      item.taskTitle.toLowerCase().includes(q) ||
      item.actionBy.toLowerCase().includes(q)
    );
  });

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
                placeholder="Search by Task ID, Title, or Action By..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pas-input"
                style={{paddingLeft: "35px"}}
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
                  <th className="px-4 py-3 font-semibold">Task Details</th>
                  <th className="px-4 py-3 font-semibold">Action By</th>
                  <th className="px-4 py-3 font-semibold">Action Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-center">Files</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
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
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Progress ID */}
                      <td className="px-4 py-3 font-mono text-[11.5px] font-semibold text-slate-600">
                        {item.progressId}
                      </td>

                      {/* Task Details */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span
                            className="font-medium text-slate-800 truncate max-w-[200px]"
                            title={item.taskTitle}
                          >
                            {item.taskTitle}
                          </span>
                          <span className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                            {item.taskAssignId}
                          </span>
                        </div>
                      </td>

                      {/* Action By */}
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {item.actionBy}
                      </td>

                      {/* Action Date */}
                      <td className="px-4 py-3 text-slate-500 text-[12px] whitespace-nowrap">
                        {item.actionDate}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold ring-1 ${item.statusColor}`}
                        >
                          {item.statusName}
                        </span>
                      </td>

                      {/* Files Icon */}
                      <td className="px-4 py-3 text-center">
                        {item.fileName ? (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-50 text-blue-600"
                            title="Has Attachment"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
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
