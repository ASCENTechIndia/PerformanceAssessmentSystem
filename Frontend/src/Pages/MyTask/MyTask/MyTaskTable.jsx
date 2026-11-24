
import { Inbox, Eye, Pencil } from "lucide-react";

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

const MyTaskTable = ({ tasks, onAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-blue-50 border-b border-slate-200">
          <tr>
            {[
              "Assignment ID",
              "Task Title",
              "Assigned By",
              "Assigned On",
              "Due Date",
              "Priority",
              "Status",
              "Action",
            ].map((heading) => (
              <th
                key={heading}
                className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
                {heading}
              </th>
            ))}
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
                key={task.TASKASSIGNMENT_ID}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-3 py-3 text-[11.5px] font-mono font-semibold text-slate-600">
                  {task.TASKASSIGNMENT_ID}
                </td>

                <td className="px-3 py-3">
                  <span
                    className="text-[12.5px] font-medium text-slate-800 truncate max-w-[240px] block"
                    title={task.TASK_TITLE}
                  >
                    {task.TASK_TITLE}
                  </span>
                </td>

                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.EMP_NAME}
                </td>

                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {formatDate(task.ASSIGNEDDATE)}
                </td>

                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap font-medium">
                  {formatDate(task.DUEDATE)}
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${
                      PRIORITY_STYLES[task.PRIORITY] ||
                      "bg-slate-50 text-slate-600 ring-slate-200"
                    }`}
                  >
                    {task.PRIORITY}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 bg-blue-50 text-blue-700 ring-blue-200">
                    {task.STATUSNAME}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onAction("View", task)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-blue-700 bg-blue-50 ring-1 ring-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onAction("Edit", task)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 hover:bg-indigo-100 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
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
