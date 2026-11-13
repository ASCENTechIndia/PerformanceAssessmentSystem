const TAB_CONFIG = [
  { key: "open", label: "Open" },
  { key: "new", label: "New" },
  { key: "in-progress", label: "In Progress" },
  { key: "rework", label: "Rework" },
  { key: "submitted", label: "Submitted" },
  { key: "completed", label: "Completed" },
];

const MyTaskTabs = ({ counts, activeTab, onChange }) => {
  return (
    <div className="border-b border-slate-200">
      <div className="flex items-center gap-1 overflow-x-auto">
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key] ?? 0;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-3 whitespace-nowrap
                text-[12.5px] font-semibold transition-colors duration-150
                ${isActive ? "text-blue-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5
                rounded-md text-[10px] font-bold transition-colors
                ${isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
              >
                {count}
              </span>
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-[2px] bg-blue-500 rounded-t" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MyTaskTabs;
