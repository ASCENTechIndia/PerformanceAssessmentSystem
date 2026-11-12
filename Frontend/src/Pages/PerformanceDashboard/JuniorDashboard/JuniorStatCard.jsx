const palette = {
  indigo: {
    soft: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-200",
    grad: "from-indigo-400 to-blue-600",
  },
  emerald: {
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    grad: "from-emerald-400 to-teal-500",
  },
  sky: {
    soft: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
    grad: "from-sky-400 to-blue-500",
  },
  rose: {
    soft: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    grad: "from-rose-400 to-pink-500",
  },
};

const JuniorStatCard = ({ label, value, color, icon: Icon }) => {
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

export default JuniorStatCard;
