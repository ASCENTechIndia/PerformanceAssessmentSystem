import { Search, X, Plus } from "lucide-react";

const TaskListFilters = ({
  filters,
  onFilterChange,
  onClear,
  taskTypes,
  parentTasks,
  onCreate,
}) => {
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

      {/* Grid — 4 filters + Create Task */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_170px_170px_150px_auto] gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search Task title or ID"
            className="pas-input pl-9"
          />
        </div>

        {/* Task Type */}
        <select
          value={filters.taskType}
          onChange={(e) => onFilterChange("taskType", e.target.value)}
          className="pas-input"
        >
          <option value="">All task types</option>
          {taskTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Parent Task */}
        <select
          value={filters.parentTask}
          onChange={(e) => onFilterChange("parentTask", e.target.value)}
          className="pas-input"
        >
          <option value="">All parents</option>
          {parentTasks.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="pas-input"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Create Task */}
        <button onClick={onCreate} className="submit-btn sm:justify-self-end">
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          Create Task
        </button>
      </div>
    </div>
  );
};

export default TaskListFilters;
