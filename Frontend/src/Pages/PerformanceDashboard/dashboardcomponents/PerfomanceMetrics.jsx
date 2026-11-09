
import React from "react";
import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  Wrench,
} from "lucide-react";

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon size={19} />
    </div>

    <p className="text-[11px] font-medium text-slate-500 mt-4">
      {title}
    </p>

    <h3 className="text-2xl font-bold text-slate-800 mt-1">
      {value}
    </h3>

    <p className="text-[10px] text-slate-400 mt-1">
      {subtitle}
    </p>
  </div>
);

export const PerformanceCards = ({ metrics }) => {
  const cards = [
    {
      title: "On-Time Completion",
      value: `${metrics.onTimeRate.toFixed(1)}%`,
      subtitle: `${metrics.onTimeCount} of ${metrics.completed} completed tasks`,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Average Delay",
      value: `${metrics.averageDelay.toFixed(1)} days`,
      subtitle: "Among late completed tasks",
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Reopened Tasks",
      value: metrics.reopenedCount,
      subtitle: "Unique tasks reopened",
      icon: RotateCcw,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Rework Rate",
      value: `${metrics.reworkRate.toFixed(1)}%`,
      subtitle: `${metrics.reworkCount} tasks sent for rework`,
      icon: Wrench,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    "In Progress": "bg-blue-50 text-blue-700",
    "Query Raised": "bg-violet-50 text-violet-700",
    Reopened: "bg-orange-50 text-orange-700",
    Rework: "bg-rose-50 text-rose-700",
    Overdue: "bg-red-50 text-red-700",
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
};
