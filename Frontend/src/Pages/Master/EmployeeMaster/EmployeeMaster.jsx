import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Inbox,
  Pencil,
  Users,
  ShieldCheck,
  UserCheck,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import EmployeeFormModal from "./EmployeeFormModal";

/* ---------- Dummy masters ---------- */
const MOCK_DESIGNATIONS = [
  { id: "g1", name: "HOD", level: 1, adminAccess: false },
  { id: "g2", name: "Senior Engineer", level: 2, adminAccess: false },
  { id: "g3", name: "Junior Engineer", level: 3, adminAccess: false },
  { id: "g4", name: "System Admin", level: 2, adminAccess: true },
  { id: "g5", name: "Trainee", level: 5, adminAccess: false },
];

const MOCK_DEPARTMENTS = [
  { id: "d1", name: "Information Technology", code: "IT", active: true },
  { id: "d2", name: "Accounts", code: "ACC", active: true },
  { id: "d3", name: "Human Resources", code: "HR", active: true },
  { id: "d4", name: "Sanitation", code: "SAN", active: true },
];

/* ---------- Dummy employees ---------- */
const MOCK_EMPLOYEES = [
  {
    id: "e1",
    empCode: "E001",
    name: "Shri Kumar",
    email: "shri@corp.in",
    mobile: "9876543210",
    designationId: "g1",
    departmentId: "d1",
    reportingOfficerId: "",
    active: true,
  },
  {
    id: "e2",
    empCode: "E002",
    name: "Ravi Sharma",
    email: "ravi@corp.in",
    mobile: "9876543211",
    designationId: "g2",
    departmentId: "d1",
    reportingOfficerId: "e1",
    active: true,
  },
  {
    id: "e3",
    empCode: "E003",
    name: "Priya Menon",
    email: "priya@corp.in",
    mobile: "9876543212",
    designationId: "g3",
    departmentId: "d1",
    reportingOfficerId: "e2",
    active: true,
  },
  {
    id: "e4",
    empCode: "E004",
    name: "Amit Patel",
    email: "amit@corp.in",
    mobile: "9876543213",
    designationId: "g3",
    departmentId: "d1",
    reportingOfficerId: "e2",
    active: true,
  },
  {
    id: "e5",
    empCode: "E005",
    name: "Sneha Iyer",
    email: "sneha@corp.in",
    mobile: "9876543214",
    designationId: "g1",
    departmentId: "d2",
    reportingOfficerId: "",
    active: true,
  },
  {
    id: "e6",
    empCode: "E006",
    name: "Suresh Rao",
    email: "suresh@corp.in",
    mobile: "9876543215",
    designationId: "g4",
    departmentId: "d1",
    reportingOfficerId: "",
    active: true,
  },
];

/* ---------- Derived role ---------- */
const computeRole = (emp, allEmployees, designations) => {
  const designation = designations.find((d) => d.id === emp.designationId);
  if (designation?.adminAccess) return "Admin";
  const hasReports = allEmployees.some((e) => e.reportingOfficerId === emp.id);
  const isSeniorTier = designation && designation.level <= 2;
  return hasReports || isSeniorTier ? "Senior" : "Junior";
};

const ROLE_STYLES = {
  Admin: {
    cls: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    icon: ShieldCheck,
  },
  Senior: {
    cls: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: UserCheck,
  },
  Junior: { cls: "bg-sky-50    text-sky-700    ring-sky-200", icon: UserIcon },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

/* ---------- Page ---------- */
const EmployeeMaster = () => {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  /* Lookup maps */
  const designationMap = useMemo(
    () => Object.fromEntries(MOCK_DESIGNATIONS.map((d) => [d.id, d])),
    [],
  );
  const departmentMap = useMemo(
    () => Object.fromEntries(MOCK_DEPARTMENTS.map((d) => [d.id, d])),
    [],
  );
  const employeeMap = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e])),
    [employees],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e) => {
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.empCode.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q);
      const matchDept = !deptFilter || e.departmentId === deptFilter;
      const role = computeRole(e, employees, MOCK_DESIGNATIONS);
      const matchRole = !roleFilter || role === roleFilter;
      return matchSearch && matchDept && matchRole;
    });
  }, [employees, search, deptFilter, roleFilter]);

  /* Role counts for summary pills */
  const counts = useMemo(() => {
    return employees.reduce(
      (acc, e) => {
        const role = computeRole(e, employees, MOCK_DESIGNATIONS);
        acc[role] += 1;
        return acc;
      },
      { Admin: 0, Senior: 0, Junior: 0 },
    );
  }, [employees]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const handleEdit = (emp) => {
    setEditing(emp);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editing) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...data } : e)),
      );
      toast.success(`${data.name} updated`);
    } else {
      setEmployees((prev) => [...prev, { id: `e${Date.now()}`, ...data }]);
      toast.success(`${data.name} created`);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const toggleActive = (id) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)),
    );
  };

  const clearFilters = () => {
    setSearch("");
    setDeptFilter("");
    setRoleFilter("");
  };
  const hasActiveFilter = search || deptFilter || roleFilter;

  return (
    <Layout
      title="Employee Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Employees",
      }}
    >
      <div className="space-y-4">
        {/* Summary pills */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(ROLE_STYLES).map(([role, cfg]) => {
            const Icon = cfg.icon;
            const active = roleFilter === role;
            return (
              <button
                key={role}
                onClick={() => setRoleFilter(active ? "" : role)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                  text-[11.5px] font-semibold ring-1 transition-all duration-150
                  ${
                    active
                      ? `${cfg.cls} shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)]`
                      : "bg-white ring-slate-200 text-slate-600 hover:ring-slate-300"
                  }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${active ? "" : "text-slate-400"}`}
                />
                {role}s
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px]
                  ${active ? "bg-white/60" : "bg-slate-100 text-slate-700"}`}
                >
                  {counts[role]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_160px_auto] gap-3 md:items-center">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or email…"
              className="pas-input"
              style={{ paddingLeft: "35px" }}
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="pas-input"
          >
            <option value="">All departments</option>
            {MOCK_DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2 md:justify-self-end">
            {hasActiveFilter && (
              <button onClick={clearFilters} className="reset-btn">
                Clear
              </button>
            )}
            <button onClick={handleAdd} className="submit-btn">
              <Plus className="w-4 h-4" strokeWidth={2.4} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Designation
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Reports To
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Inbox className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-[13px] font-semibold text-slate-700">
                        {employees.length === 0
                          ? "No employees yet"
                          : "No employees match your filters"}
                      </p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">
                        {employees.length === 0
                          ? 'Click "Add Employee" to create the first one.'
                          : "Try clearing filters or changing the search."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => {
                    const designation = designationMap[emp.designationId];
                    const department = departmentMap[emp.departmentId];
                    const officer = employeeMap[emp.reportingOfficerId];
                    const role = computeRole(emp, employees, MOCK_DESIGNATIONS);
                    const roleCfg = ROLE_STYLES[role];
                    const RoleIcon = roleCfg.icon;

                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-500
                              text-white text-[11px] font-semibold flex items-center justify-center flex-shrink-0"
                            >
                              {getInitials(emp.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] font-medium text-slate-800 truncate">
                                {emp.name}
                              </span>
                              <span className="text-[10.5px] text-slate-500 font-mono">
                                {emp.empCode}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="hidden md:table-cell px-4 py-3">
                          {designation ? (
                            <div className="flex flex-col">
                              <span className="text-[12.5px] text-slate-700">
                                {designation.name}
                              </span>
                              <span className="text-[10.5px] text-slate-400">
                                Level {designation.level}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11.5px] text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        <td className="hidden lg:table-cell px-4 py-3 text-[12.5px] text-slate-600">
                          {department?.name || "—"}
                        </td>

                        <td className="hidden lg:table-cell px-4 py-3 text-[12.5px] text-slate-600">
                          {officer ? (
                            <span
                              className="truncate max-w-[140px] block"
                              title={officer.name}
                            >
                              {officer.name}
                            </span>
                          ) : (
                            <span className="text-[11.5px] text-slate-400 italic">
                              Top of hierarchy
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                            text-[10.5px] font-semibold ring-1 ${roleCfg.cls}`}
                          >
                            <RoleIcon
                              className="w-2.5 h-2.5"
                              strokeWidth={2.4}
                            />
                            {role}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleActive(emp.id)}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                              text-[10.5px] font-semibold ring-1 transition-colors
                              ${
                                emp.active
                                  ? "bg-blue-50 text-blue-700 ring-blue-200 hover:bg-blue-100"
                                  : "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${emp.active ? "bg-blue-500" : "bg-slate-400"}`}
                            />
                            {emp.active ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                              text-[11.5px] font-medium text-slate-600 bg-white
                              ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300
                              transition-colors"
                          >
                            <Pencil className="w-3 h-3" strokeWidth={2.2} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11.5px] text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          of {employees.length} employees
          {hasActiveFilter && (
            <span className="ml-1 text-slate-400">· filtered</span>
          )}
        </p>
      </div>

      <EmployeeFormModal
        open={modalOpen}
        employee={editing}
        employees={employees}
        designations={MOCK_DESIGNATIONS}
        departments={MOCK_DEPARTMENTS}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default EmployeeMaster;
