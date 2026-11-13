import { Search, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_OPTIONS = ["Active", "Inactive"];

const TaskTypeFilters = ({ filters, onFilterChange, onClear }) => {
  const hasActive = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4 space-y-3">
      {/* Header */}
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

      {/* Filter grid — 2 fields + Add button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_auto] gap-3">
        {/* Task Type Name */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.name}
            onChange={(e) => onFilterChange("name", e.target.value)}
            placeholder="Search task type name…"
            className="pas-input"
            style={{ paddingLeft: "35px" }}
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="pas-input"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Add Task Type */}
        <Link
          to="/master/add-task-type"
          className="submit-btn sm:justify-self-end"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Add Task Type
        </Link>
      </div>
    </div>
  );
};

export default TaskTypeFilters;
