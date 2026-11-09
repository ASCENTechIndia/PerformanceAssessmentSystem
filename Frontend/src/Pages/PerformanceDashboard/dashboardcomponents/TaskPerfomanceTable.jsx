
import React from "react";
import { formatDate, getEmployeeName, dayDifference } from "../performanceData";
import { StatusBadge } from "./PerfomanceMetrics";

const TaskPerformanceTable = ({
  tasks,
  showEmployee = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800">
          Task Performance Details
        </h3>
        <p className="text-[10px] text-slate-400 mt-1">
          Task completion and deadline analysis
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50">
            <tr className="text-[10px] uppercase text-slate-500">
              <th className="px-4 py-3">Task</th>

              {showEmployee && (
                <th className="px-4 py-3">Employee</th>
              )}

              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Completed On</th>
              <th className="px-4 py-3">Delay</th>
              <th className="px-4 py-3">Reopened</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={showEmployee ? 8 : 7}
                  className="text-center py-8 text-xs text-slate-400"
                >
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const delay = task.completedAt
                  ? dayDifference(
                      task.completedAt,
                      task.approvedDeadline
                    )
                  : null;

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50 text-[11px]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-700">
                        {task.title}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1">
                        {task.id} · {task.type}
                      </p>
                    </td>

                    {showEmployee && (
                      <td className="px-4 py-3 text-slate-600">
                        {getEmployeeName(task.employeeId)}
                      </td>
                    )}

                    <td className="px-4 py-3 text-slate-600">
                      {task.priority}
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(task.approvedDeadline)}
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(task.completedAt)}
                    </td>

                    <td className="px-4 py-3">
                      {delay === null ? (
                        "-"
                      ) : delay > 0 ? (
                        <span className="text-rose-600 font-semibold">
                          +{delay} days
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">
                          {delay === 0
                            ? "On time"
                            : `${Math.abs(delay)} days early`}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {task.reopenCount}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskPerformanceTable;
