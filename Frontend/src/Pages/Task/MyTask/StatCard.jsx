const StatCard = ({ label, count, color, icon: Icon, active, onClick }) => {
  const palette = {
    indigo: {
      soft: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "ring-indigo-200",
      ringActive: "ring-indigo-300",
      grad: "from-indigo-400 to-blue-600",
      dot: "bg-indigo-500",
    },
    violet: {
      soft: "bg-violet-50",
      text: "text-violet-700",
      ring: "ring-violet-200",
      ringActive: "ring-violet-300",
      grad: "from-violet-400 to-purple-500",
      dot: "bg-violet-500",
    },
    sky: {
      soft: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
      ringActive: "ring-sky-300",
      grad: "from-sky-400 to-blue-500",
      dot: "bg-sky-500",
    },
    amber: {
      soft: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      ringActive: "ring-amber-300",
      grad: "from-amber-400 to-orange-500",
      dot: "bg-amber-500",
    },
    rose: {
      soft: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      ringActive: "ring-rose-300",
      grad: "from-rose-400 to-pink-500",
      dot: "bg-rose-500",
    },
    emerald: {
      soft: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      ringActive: "ring-emerald-300",
      grad: "from-emerald-400 to-teal-500",
      dot: "bg-emerald-500",
    },
  };
  const p = palette[color];

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden flex flex-col items-stretch p-3.5 rounded-xl text-left
        ${p.soft} ${active ? p.ringActive : p.ring}
        ring-1 transition-all duration-200
        ${
          active
            ? "shadow-[0_6px_16px_-6px_rgba(15,23,42,0.15)]"
            : "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(15,23,42,0.12)]"
        }`}
    >
      <div className="relative flex items-start justify-between mb-2.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center
          bg-gradient-to-br ${p.grad} text-white shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]`}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
        </div>
        {active && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${p.dot} animate-pulse
            shadow-[0_0_0_3px_rgba(255,255,255,0.9)]`}
          />
        )}
      </div>

      <p
        className={`relative text-[10.5px] font-semibold uppercase tracking-wider ${p.text}`}
      >
        {label}
      </p>
      <p
        className={`relative mt-0.5 text-[24px] font-bold leading-none tracking-tight ${p.text}`}
      >
        {count}
      </p>

      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${p.grad}
        transition-opacity duration-200
        ${active ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}
      />
    </button>
  );
};

export default StatCard;
