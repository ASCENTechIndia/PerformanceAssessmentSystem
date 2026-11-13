import { Users } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const EmployeePerformanceList = ({ employees }) => {
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500 text-white
          flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]"
        >
          <Users className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800">
            Employee-wise Performance
          </h3>
          <p className="text-[10.5px] text-slate-400">
            Compare on-time completion among junior employees
          </p>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {employees.length === 0 ? (
          <p className="text-center py-8 text-[12px] text-slate-500">
            No employees in scope
          </p>
        ) : (
          employees.map((emp) => (
            <div key={emp.id}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-500
                    text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0"
                  >
                    {getInitials(emp.name)}
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-slate-800">
                      {emp.name}
                    </p>
                    <p className="text-[10.5px] text-slate-500">
                      {emp.completed} completed / {emp.total} assigned
                    </p>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-blue-700">
                  {emp.onTimeRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-500"
                  style={{ width: `${emp.onTimeRate}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-400">
                  Reopened:{" "}
                  <b className="text-slate-600">{emp.reopenedCount}</b>
                </span>
                <span className="text-[10px] text-slate-400">
                  Rework:{" "}
                  <b className="text-slate-600">{emp.reworkRate.toFixed(1)}%</b>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeePerformanceList;
