import { Inbox, UserPlus } from "lucide-react";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TaskListTable = ({ tasks, onAssign }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-blue-50 border-b border-slate-200">
          <tr>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Task ID
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Task Title
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Expected Duration
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Parent
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Created
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assigned To
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
                  No tasks match your filters
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
                {/* Task ID */}
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-mono font-semibold
                    bg-slate-100 text-slate-600 rounded"
                  >
                    {task.id}
                  </span>
                </td>

                {/* Task Title */}
                <td className="px-3 py-3">
                  <span
                    className="text-[12.5px] font-medium text-slate-800 truncate max-w-[240px] block"
                    title={task.title}
                  >
                    {task.title}
                  </span>
                </td>

                {/* Expected Duration */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.expectedDuration} days
                </td>

                {/* Parent */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.parent ? (
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-mono
                      bg-violet-50 text-violet-700 rounded"
                    >
                      {task.parent}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">—</span>
                  )}
                </td>

                {/* Created */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {formatDate(task.createdAt)}
                </td>

                {/* Assigned To */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.assignedTo ? (
                    <span className="font-medium text-slate-800">
                      {task.assignedTo}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Unassigned
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                    text-[10.5px] font-semibold ring-1
                    ${
                      task.active
                        ? "bg-blue-50 text-blue-700 ring-blue-200"
                        : "bg-slate-100 text-slate-500 ring-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${task.active ? "bg-blue-500" : "bg-slate-400"}`}
                    />
                    {task.active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Action */}
                <td className="px-3 py-3 text-right">
                  <button
                    onClick={() => onAssign(task)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      text-[11.5px] font-semibold text-white bg-blue-500
                      hover:bg-blue-600 active:scale-[0.97]
                      transition-all duration-150"
                  >
                    <UserPlus className="w-3 h-3" strokeWidth={2.4} />
                    Assign
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
