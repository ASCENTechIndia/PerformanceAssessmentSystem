import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, Plus, Users, UserCheck, UserX, Inbox } from "lucide-react";
import Layout from "../../../Components/Layout";
import apiClient from "../../../../apiClient";

const EmployeeMappingList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch data on load
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/getEmployeeMappingList");
        if (res?.success && Array.isArray(res.data)) {
          setEmployees(res.data);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load employees",
        );
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        String(e.EMP_NAME ?? "")
          .toLowerCase()
          .includes(q) ||
        String(e.EMP_ID ?? "")
          .toLowerCase()
          .includes(q) ||
        String(e.DEPT_NAME ?? "")
          .toLowerCase()
          .includes(q),
    );
  }, [employees, search]);

  // Stats logic
  const stats = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(
        (e) => String(e.ISACTIVE) === "Y" || Number(e.ISACTIVE) === 1,
      ).length,
      inactive: employees.filter(
        (e) => String(e.ISACTIVE) === "N" || Number(e.ISACTIVE) === 0,
      ).length,
    };
  }, [employees]);

  return (
    <Layout
      title="Employee Hierarchy Mappingg"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Employee Hierarchy Mapping",
      }}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/master/Employee-mapping-form")}
            className="submit-btn"
          >
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            Add Employee Mapping
          </button>
        </div>

        {/* ===== Stat Cards ===== */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Total Employees"
            value={stats.total}
            tone="blue"
            icon={Users}
          />
          <StatCard
            label="Active"
            value={stats.active}
            tone="green"
            icon={UserCheck}
          />
          <StatCard
            label="Inactive"
            value={stats.inactive}
            tone="slate"
            icon={UserX}
          />
        </div>

        {/* ===== Table Container ===== */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Employee Name, ID, or Department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pas-input"
                style={{ paddingLeft: "35px" }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {filtered.length} of {employees.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Designation</th>
                  <th className="px-4 py-3 font-semibold">Reporting To</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      <div className="inline-flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="opacity-25"
                          />
                          <path
                            fill="currentColor"
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Loading employee mappings...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Inbox className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          No records found
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Try adjusting your search term.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => {
                    const isActive =
                      String(emp.ISACTIVE) === "Y" ||
                      Number(emp.ISACTIVE) === 1;

                    return (
                      <tr
                        key={emp.EMP_ID}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800">
                              {emp.EMP_NAME}
                            </span>
                            <span className="text-[12px] font-mono text-slate-500">
                              {emp.EMP_ID}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {emp.DEPT_NAME || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {emp.DESI_NAME || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {emp.REPORTING_NAME ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800">
                                {emp.REPORTING_NAME}
                              </span>
                              <span className="text-[12px] font-mono text-slate-500">
                                {emp.REPORTINGTO}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Top Level
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10.5px] font-semibold text-blue-700 ring-1 ring-blue-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500 ring-1 ring-slate-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/* --- Stat Card Component --- */
const StatCard = ({ label, value, tone, icon: Icon }) => {
  const tones = {
    blue: "bg-blue-50 ring-blue-200 text-blue-700",
    green: "bg-emerald-50 ring-emerald-200 text-emerald-700",
    slate: "bg-slate-50 ring-slate-200 text-slate-700",
  };

  return (
    <div
      className={`relative overflow-hidden flex items-center gap-3 p-4 rounded-xl ring-1 ${tones[tone] || tones.slate}`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/60`}
      >
        <Icon className="w-5 h-5" strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-[10.5px] font-semibold uppercase tracking-wider opacity-80">
          {label}
        </p>
        <p
          className="font-bold leading-none mt-0.5"
          style={{ fontSize: "23px" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default EmployeeMappingList;
