import { Inbox, Eye, Pencil, Trash2 } from "lucide-react";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const EmployeeTable = ({
  employees,
  departments,
  designations,
  onView,
  onEdit,
  onDelete,
}) => {
  const departmentMap = Object.fromEntries(departments.map((d) => [d.id, d]));
  const designationMap = Object.fromEntries(designations.map((d) => [d.id, d]));
  const employeeMap = Object.fromEntries(employees.map((e) => [e.id, e]));

  return (
    <div className="rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blue-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-12">
                Sr. No
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Employee Code
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Employee Name
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                ULB
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Department
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Designation
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Reporting To
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Mobile
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Joining Date
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Inbox className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-[13px] font-semibold text-slate-700">
                    No employees match your filters
                  </p>
                  <p className="text-[11.5px] text-slate-500 mt-0.5">
                    Try clearing filters or changing the search terms.
                  </p>
                </td>
              </tr>
            ) : (
              employees.map((emp, idx) => {
                const department = departmentMap[emp.departmentId];
                const designation = designationMap[emp.designationId];
                const officer = employeeMap[emp.reportingOfficerId];

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-3 py-3 text-[11.5px] font-mono text-slate-400">
                      {String(idx + 1).padStart(2, "0")}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-mono font-semibold
                        bg-slate-100 text-slate-600 rounded"
                      >
                        {emp.empCode}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="text-[12.5px] font-medium text-slate-800 truncate max-w-[160px] block"
                        title={emp.name}
                      >
                        {emp.name}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                      {emp.ulb}
                    </td>

                    <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                      {department?.name || "—"}
                    </td>

                    <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                      {designation?.name || "—"}
                    </td>

                    <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                      {officer ? (
                        <span
                          className="truncate max-w-[120px] block"
                          title={officer.name}
                        >
                          {officer.name}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3 text-[12px] font-mono text-slate-600 whitespace-nowrap">
                      {emp.mobile || "—"}
                    </td>

                    <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                      {formatDate(emp.joiningDate)}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                        text-[10.5px] font-semibold ring-1
                        ${emp.active
                            ? "bg-blue-50 text-blue-700 ring-blue-200"
                            : "bg-slate-100 text-slate-500 ring-slate-200"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${emp.active ? "bg-blue-500" : "bg-slate-400"}`}
                        />
                        {emp.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => onView?.(emp)}
                          title="View Employee"
                          className="w-7 h-7 flex items-center justify-center rounded-md
      text-blue-600 bg-blue-50 hover:bg-blue-100
      transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit?.(emp)}
                          title="Edit Employee"
                          className="w-7 h-7 flex items-center justify-center rounded-md
      text-amber-600 bg-amber-50 hover:bg-amber-100
      transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete?.(emp)}
                          title="Delete Employee"
                          className="w-7 h-7 flex items-center justify-center rounded-md
      text-rose-600 bg-rose-50 hover:bg-rose-100
      transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
