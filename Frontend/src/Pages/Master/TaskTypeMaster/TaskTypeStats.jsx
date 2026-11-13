import { useMemo } from "react";
import { LayoutList, CheckCircle2, XCircle } from "lucide-react";

const StatCard = ({ label, value, color, icon: Icon }) => {
  const palette = {
    blue: {
      soft: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-200",
      grad: "from-blue-500 to-sky-500",
    },
    emerald: {
      soft: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      grad: "from-emerald-500 to-teal-500",
    },
    slate: {
      soft: "bg-slate-50",
      text: "text-slate-700",
      ring: "ring-slate-200",
      grad: "from-slate-400 to-slate-500",
    },
  };
  const p = palette[color];

  return (
    <div
      className={`relative overflow-hidden flex items-center gap-3 p-4 rounded-xl ${p.soft} ring-1 ${p.ring}`}
    >
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.grad} text-white
        flex items-center justify-center flex-shrink-0
        shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]`}
      >
        <Icon className="w-4 h-4" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p
          className={`text-[10.5px] font-semibold uppercase tracking-wider ${p.text}`}
        >
          {label}
        </p>
        <p className={`text-[22px] font-bold leading-none mt-0.5 ${p.text}`}>
          {value}
        </p>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${p.grad} opacity-60`}
      />
    </div>
  );
};

const TaskTypeStats = ({ taskTypes }) => {
  const stats = useMemo(
    () => ({
      total: taskTypes.length,
      active: taskTypes.filter((t) => t.active).length,
      inactive: taskTypes.filter((t) => !t.active).length,
    }),
    [taskTypes],
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <StatCard
        label="Total Task Types"
        value={stats.total}
        color="blue"
        icon={LayoutList}
      />
      <StatCard
        label="Active"
        value={stats.active}
        color="emerald"
        icon={CheckCircle2}
      />
      <StatCard
        label="Inactive"
        value={stats.inactive}
        color="slate"
        icon={XCircle}
      />
    </div>
  );
};

export default TaskTypeStats;
