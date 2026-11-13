import { Search, X } from "lucide-react";

const TASK_TYPES = ["Inspection", "Audit", "Review", "Report", "Site Visit"];
const PRIORITIES = ["High", "Medium", "Critical", "Low"];
const DUE_DATE_OPTIONS = [
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
];

const MyTaskFilters = ({ filters, onFilterChange, onClear }) => {
  const hasActive = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-sky-500" />
          <p className="text-[11.5px] font-bold uppercase tracking-wider text-slate-600">
            Filters
          </p>
          {hasActive && (
            <span
              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
              rounded-md text-[9.5px] font-bold bg-blue-100 text-blue-700"
            >
              {Object.values(filters).filter((v) => v !== "").length}
            </span>
          )}
        </div>

        {hasActive && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-rose-600
              hover:text-rose-700 transition-colors"
          >
            <X className="w-3 h-3" strokeWidth={2.4} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_150px_150px_150px] gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Task title or ID"
            className="pas-input pl-9"
          />
        </div>

        {/* Task Type */}
        <select
          value={filters.taskType}
          onChange={(e) => onFilterChange("taskType", e.target.value)}
          className="pas-input"
        >
          <option value="">All Task Types</option>
          {TASK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className="pas-input"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Due Date */}
        <select
          value={filters.dueDate}
          onChange={(e) => onFilterChange("dueDate", e.target.value)}
          className="pas-input"
        >
          <option value="">Any Due Date</option>
          {DUE_DATE_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MyTaskFilters;
