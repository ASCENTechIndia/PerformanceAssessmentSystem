import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const ULB_OPTIONS = [
  "Nagpur Municipal Corp",
  "Pune Municipal Corp",
  "Mumbai Municipal Corp",
  "Nashik Municipal Corp",
];

const STATUS_OPTIONS = ["Active", "Inactive"];

const EmployeeFilters = ({
  filters,
  onFilterChange,
  onClear,
  departments,
  designations,
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

      {/* Filter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <select
          value={filters.ulb}
          onChange={(e) => onFilterChange("ulb", e.target.value)}
          className="pas-input"
        >
          <option value="">All ULBs</option>
          {ULB_OPTIONS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <select
          value={filters.departmentId}
          onChange={(e) => onFilterChange("departmentId", e.target.value)}
          className="pas-input"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={filters.designationId}
          onChange={(e) => onFilterChange("designationId", e.target.value)}
          className="pas-input"
        >
          <option value="">All designations</option>
          {designations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.empCode}
            onChange={(e) => onFilterChange("empCode", e.target.value)}
            placeholder="Employee code…"
            className="pas-input"
            style={{ paddingLeft: "30px" }}
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.name}
            onChange={(e) => onFilterChange("name", e.target.value)}
            placeholder="Employee name…"
            className="pas-input"
            style={{ paddingLeft: "30px" }}
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="tel"
            inputMode="numeric"
            value={filters.mobile}
            onChange={(e) =>
              onFilterChange(
                "mobile",
                e.target.value.replace(/\D/g, "").slice(0, 10),
              )
            }
            placeholder="Mobile number…"
            className="pas-input"
            style={{ paddingLeft: "30px" }}
          />
        </div>

        <div className="">
          <Link to="/master/add-employee" className="submit-btn w-full">
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Add Employee
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFilters;
