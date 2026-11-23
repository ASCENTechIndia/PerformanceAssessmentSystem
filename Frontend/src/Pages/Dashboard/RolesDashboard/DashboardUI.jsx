
import React from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

const tones = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
};

export const DashboardHeader = ({ title, subtitle, right }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
    {right}
  </div>
);

export const Panel = ({ title, subtitle, action, children }) => (
  <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
      <div>
        <h3 className="text-[13px] font-bold text-slate-800">{title}</h3>
        {subtitle && (
          <p className="text-[10.5px] text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
    <div className="p-4">{children}</div>
  </section>
);

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "blue",
  trend,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
    <div className="flex justify-between items-start gap-2">
      <div>
        <p className="text-[11px] font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tones[tone]}`}>
        {Icon && <Icon className="w-[18px] h-[18px]" />}
      </div>
    </div>
    <div className="flex items-center justify-between gap-2 mt-3">
      <p className=" text-slate-500" style={{fontSize: "23px"}}>{subtitle}</p>
      {trend && (
        <span className={`text-[10px] font-semibold flex items-center gap-1 ${
          trend.direction === "down" ? "text-rose-600" : "text-emerald-600"
        }`}>
          {trend.direction === "down" ? (
            <TrendingDown className="w-3 h-3" />
          ) : (
            <TrendingUp className="w-3 h-3" />
          )}
          {trend.value}
        </span>
      )}
    </div>
  </div>
);

export const ProgressRow = ({ label, value, total, color = "bg-blue-500" }) => {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11.5px] font-medium text-slate-700">{label}</span>
        <span className="text-[11px] font-semibold text-slate-600">
          {value} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Submitted: "bg-violet-50 text-violet-700 ring-violet-200",
  Reopened: "bg-rose-50 text-rose-700 ring-rose-200",
  Overdue: "bg-rose-50 text-rose-700 ring-rose-200",
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${
    statusStyles[status] || "bg-slate-100 text-slate-600 ring-slate-200"
  }`}>
    {status}
  </span>
);

export const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "bg-rose-50 text-rose-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
      styles[priority] || styles.Low
    }`}>
      {priority || "—"}
    </span>
  );
};

export const TaskTable = ({ tasks = [], showAssignee = false }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left min-w-[620px]">
      <thead>
        <tr className="border-b border-slate-100">
          {["Task", ...(showAssignee ? ["Assigned To"] : []), "Due Date", "Priority", "Status"].map((heading) => (
            <th key={heading} className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {tasks.length ? tasks.map((task) => (
          <tr key={task.id} className="hover:bg-slate-50/70">
            <td className="px-3 py-3">
              <p className="text-[11.5px] font-semibold text-slate-800">{task.title}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{task.id}</p>
            </td>
            {showAssignee && (
              <td className="px-3 py-3 text-[11px] text-slate-600">{task.assignee || "—"}</td>
            )}
            <td className="px-3 py-3 text-[11px] text-slate-600 whitespace-nowrap">{task.dueDate}</td>
            <td className="px-3 py-3"><PriorityBadge priority={task.priority} /></td>
            <td className="px-3 py-3"><StatusBadge status={task.status} /></td>
          </tr>
        )) : (
          <tr>
            <td colSpan={showAssignee ? 5 : 4} className="text-center py-8 text-xs text-slate-400">
              No tasks available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export const InfoList = ({ items = [], emptyText = "No information available" }) => (
  <div className="space-y-3">
    {items.length ? items.map((item, index) => (
      <div key={item.id || index} className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
          item.color || "bg-blue-500"
        }`} />
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-medium text-slate-700">{item.title}</p>
          {item.description && (
            <p className="text-[10.5px] text-slate-500 mt-0.5">{item.description}</p>
          )}
          {item.time && (
            <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
          )}
        </div>
      </div>
    )) : (
      <p className="text-xs text-slate-400 text-center py-5">{emptyText}</p>
    )}
  </div>
);

export const ViewAllLink = ({ onClick, children = "View All" }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-600 hover:text-blue-700"
  >
    {children}
    <ArrowUpRight className="w-3 h-3" />
  </button>
);
