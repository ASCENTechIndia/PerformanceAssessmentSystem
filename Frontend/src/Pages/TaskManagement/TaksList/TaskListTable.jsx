import { Inbox, Pencil, UserPlus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const   TaskListTable = ({ tasks, onAssign, allowAssign, onView  }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-blue-50 border-b border-slate-200">
          <tr>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Task ID
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Task Title
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Expected Duration
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Assign To
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Parent
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Created
            </th>
            {/* <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assigned To
            </th> */}
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Status
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-800 text-right">
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
                    className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] 
                    bg-slate-100 text-slate-600 rounded"
                  >
                    {task.id}
                  </span>
                </td>

                {/* Task Title */}
                <td className="px-3 py-3">
                  <span
                    className="text-[12.5px] text-slate-600 truncate max-w-[240px] block"
                    title={task.title}
                  >
                    {task.title}
                  </span>
                </td>

                {/* Expected Duration */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.expectedDuration} days
                </td>

                {/* Assign To */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.assignTo}
                </td>

                {/* Parent */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.parent ? (
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-mono
                      bg-violet-50 text-violet-700 rounded"
                    >
                      No
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Yes
                    </span>
                  )}
                </td>

                {/* Created */}
                <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {formatDate(task.createdAt)}
                </td>

                {/* Assigned To */}
                {/* <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                  {task.assignedTo ? (
                    <span className="font-medium text-slate-800">
                      {task.assignedTo}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Unassigned
                    </span>
                  )}
                </td> */}

                {/* Status */}

                {/* Status */}
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-semibold ring-1"
                    style={{
                      backgroundColor: task.bgColor,
                      color: task.foreColor,
                      borderColor: task.bgColor,
                    }}
                  >
                    {task.statusName}
                  </span>
                </td>

                {/* Action */}
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* NEW VIEW BUTTON */}
                    <button
                      onClick={() => onView(task)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 bg-slate-100 ring-1 ring-slate-200 hover:bg-slate-200 transition-colors"
                      title="View Full Details"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      disabled={allowAssign}
                      onClick={() => onAssign(task)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                        text-[13px] font-semibold transition-all duration-150
                        ${
                          allowAssign
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.97]"
                        }`}
                    >
                      <UserPlus className="w-3 h-3" strokeWidth={2.4} />
                      Assign
                    </button>

                    <button
                      onClick={() =>
                        navigate("/Task/task-status", { state: { task } })
                      }
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

export default TaskListTable;
