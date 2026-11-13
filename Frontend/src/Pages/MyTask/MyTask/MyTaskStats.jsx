import { useMemo } from "react";
import { Inbox, PlayCircle, RotateCcw, Send, CheckCircle2 } from "lucide-react";

const StatCard = ({ label, value, color, icon: Icon }) => {
  const palette = {
    blue: {
      soft: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-200",
      grad: "from-blue-500 to-sky-500",
    },
    indigo: {
      soft: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
      grad: "from-indigo-400 to-blue-600",
    },
    rose: {
      soft: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      grad: "from-rose-400 to-pink-500",
    },
    amber: {
      soft: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      grad: "from-amber-400 to-orange-500",
    },
    emerald: {
      soft: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      grad: "from-emerald-500 to-teal-500",
    },
  };
  const p = palette[color];

  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-center p-4 rounded-xl ${p.soft} ring-1 ${p.ring}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.grad} text-white
          flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_-1px_rgba(15,23,42,0.2)]`}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
        </div>
        <p
          className={`text-[10.5px] font-semibold uppercase tracking-wider ${p.text}`}
        >
          {label}
        </p>
      </div>
      <p className={`text-[24px] font-bold leading-none ${p.text}`}>{value}</p>
      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${p.grad} opacity-60`}
      />
    </div>
  );
};

const MyTaskStats = ({ tasks }) => {
  const stats = useMemo(
    () => ({
      new: tasks.filter((t) => t.status === "New").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      rework: tasks.filter((t) => t.status === "Rework").length,
      submitted: tasks.filter((t) => t.status === "Submitted").length,
      completed: tasks.filter((t) => t.status === "Completed").length,
    }),
    [tasks],
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard label="New" value={stats.new} color="blue" icon={Inbox} />
      <StatCard
        label="In Progress"
        value={stats.inProgress}
        color="indigo"
        icon={PlayCircle}
      />
      <StatCard
        label="Rework/Overdue"
        value={stats.rework}
        color="rose"
        icon={RotateCcw}
      />
      <StatCard
        label="Awaiting Approval"
        value={stats.submitted}
        color="amber"
        icon={Send}
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        color="emerald"
        icon={CheckCircle2}
      />
    </div>
  );
};

export default MyTaskStats;
