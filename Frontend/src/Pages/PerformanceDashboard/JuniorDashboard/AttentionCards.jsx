import { AlertTriangle, RotateCcw, FileText } from "lucide-react";

const AttentionCards = ({ overdueCount, reopenedCount, reworkCount }) => {
  const cards = [
    {
      key: "overdue",
      label: "OVERDUE",
      value: overdueCount,
      description: "Past approved deadline",
      icon: AlertTriangle,
      cls: {
        bg: "bg-rose-50",
        ring: "ring-rose-200",
        text: "text-rose-700",
        soft: "text-rose-600",
        grad: "from-rose-400 to-pink-500",
      },
    },
    {
      key: "reopened",
      label: "REOPENED",
      value: reopenedCount,
      description: "Requires further completion",
      icon: RotateCcw,
      cls: {
        bg: "bg-orange-50",
        ring: "ring-orange-200",
        text: "text-orange-700",
        soft: "text-orange-600",
        grad: "from-orange-400 to-amber-500",
      },
    },
    {
      key: "rework",
      label: "REWORK",
      value: reworkCount,
      description: "Requires corrections",
      icon: FileText,
      cls: {
        bg: "bg-amber-50",
        ring: "ring-amber-200",
        text: "text-amber-700",
        soft: "text-amber-600",
        grad: "from-amber-400 to-yellow-500",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={`relative overflow-hidden p-4 rounded-xl ${c.cls.bg} ring-1 ${c.cls.ring}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest ${c.cls.soft}`}
                >
                  {c.label}
                </p>
                <p
                  className={`text-[32px] font-bold leading-none mt-2 ${c.cls.text}`}
                >
                  {c.value}
                </p>
                <p className={`text-[10.5px] ${c.cls.soft} mt-1`}>
                  {c.description}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.cls.grad} text-white
                flex items-center justify-center flex-shrink-0 opacity-90`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.2} />
              </div>
            </div>
            <div
              className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${c.cls.grad} opacity-60`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AttentionCards;
