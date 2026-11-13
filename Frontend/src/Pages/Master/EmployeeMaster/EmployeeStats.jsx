import { useMemo } from "react";
import { Users, UserCheck, UserX, CalendarPlus } from "lucide-react";

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
    violet: {
      soft: "bg-violet-50",
      text: "text-violet-700",
      ring: "ring-violet-200",
      grad: "from-violet-400 to-purple-500",
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

const EmployeeStats = ({ employees }) => {
  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return {
      total: employees.length,
      active: employees.filter((e) => e.active).length,
      inactive: employees.filter((e) => !e.active).length,
      joinedThisYear: employees.filter(
        (e) =>
          e.joiningDate &&
          new Date(e.joiningDate).getFullYear() === currentYear,
      ).length,
    };
  }, [employees]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Total Employees"
        value={stats.total}
        color="blue"
        icon={Users}
      />
      <StatCard
        label="Active"
        value={stats.active}
        color="emerald"
        icon={UserCheck}
      />
      <StatCard
        label="Inactive"
        value={stats.inactive}
        color="slate"
        icon={UserX}
      />
      <StatCard
        label="Joined This Year"
        value={stats.joinedThisYear}
        color="violet"
        icon={CalendarPlus}
      />
    </div>
  );
};

export default EmployeeStats;
