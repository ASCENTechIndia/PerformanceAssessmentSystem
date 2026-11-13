import { Inbox, Play, Edit, Eye } from "lucide-react";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PRIORITY_STYLES = {
  Critical: "bg-rose-50 text-rose-700 ring-rose-200",
  High: "bg-orange-50 text-orange-700 ring-orange-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-slate-50 text-slate-600 ring-slate-200",
};

const STATUS_STYLES = {
  New: "bg-blue-50 text-blue-700 ring-blue-200",
  "In Progress": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Rework: "bg-rose-50 text-rose-700 ring-rose-200",
  Submitted: "bg-amber-50 text-amber-700 ring-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const MyTaskTable = ({ tasks, onAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assignment ID
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Task Title
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assigned By
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assigned On
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Due Date
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Priority
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Status
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-16 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Inbox className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-[13px] font-semibold text-slate-700">
                  No tasks found
                </p>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  Try clearing filters or switching tabs.
                </p>
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-3 py-3 text-[11.5px] font-mono font-semibold text-slate-600">
                  {task.id}
                </td>
                <td className="px-3 py-3">
                  <span
                    className="text-[12.5px] font-medium text-slate-800 truncate max-w-[240px] block"
                    title={task.title}
                  >
                    {task.title}
                  </span>
                </td>
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.assignedBy}
                </td>
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {formatDate(task.assignedOn)}
                </td>
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap font-medium">
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${PRIORITY_STYLES[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${STATUS_STYLES[task.status]}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  {/* Dynamic Action Button based on status */}
                  {task.status === "New" && (
                    <button
                      onClick={() => onAction("Start", task)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      <Play className="w-3 h-3" strokeWidth={2.5} /> Start
                    </button>
                  )}
                  {task.status === "In Progress" && (
                    <button
                      onClick={() => onAction("Work on Task", task)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 hover:bg-indigo-100 transition-colors"
                    >
                      <Edit className="w-3 h-3" strokeWidth={2.5} /> Work on
                      Task
                    </button>
                  )}
                  {task.status === "Rework" && (
                    <button
                      onClick={() => onAction("Rework", task)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold text-rose-700 bg-rose-50 ring-1 ring-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      <Edit className="w-3 h-3" strokeWidth={2.5} /> Rework
                    </button>
                  )}
                  {(task.status === "Submitted" ||
                    task.status === "Completed") && (
                    <button
                      onClick={() => onAction("View", task)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold text-slate-600 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-3 h-3" strokeWidth={2.5} /> View
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyTaskTable;
