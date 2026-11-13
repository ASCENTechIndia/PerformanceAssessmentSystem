import { useState, useMemo } from "react";
import { Search, Plus, Inbox, Pencil, Building2, Users } from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import DepartmentFormModal from "./DepartmentFormModal";

/* ---------- Dummy data ---------- */
const MOCK_DEPARTMENTS = [
  {
    id: "d1",
    name: "Information Technology",
    code: "IT",
    headId: "e101",
    description: "Software, hardware, networking",
    active: true,
  },
  {
    id: "d2",
    name: "Accounts",
    code: "ACC",
    headId: "e102",
    description: "Finance and billing",
    active: true,
  },
  {
    id: "d3",
    name: "Human Resources",
    code: "HR",
    headId: "",
    description: "Recruitment and employee welfare",
    active: true,
  },
  {
    id: "d4",
    name: "Sanitation",
    code: "SAN",
    headId: "e104",
    description: "Waste management and cleaning",
    active: true,
  },
  {
    id: "d5",
    name: "Water Supply",
    code: "WS",
    headId: "",
    description: "Water distribution and maintenance",
    active: false,
  },
];

const MOCK_EMPLOYEES = [
  { id: "e101", name: "Ravi Sharma", designation: "HOD" },
  { id: "e102", name: "Priya Menon", designation: "Senior Engineer" },
  { id: "e103", name: "Amit Patel", designation: "Junior Engineer" },
  { id: "e104", name: "Sneha Iyer", designation: "HOD" },
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const DepartmentMaster = () => {
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return departments.filter(
      (d) =>
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.code || "").toLowerCase().includes(q),
    );
  }, [departments, search]);

  const headMap = useMemo(
    () => Object.fromEntries(MOCK_EMPLOYEES.map((e) => [e.id, e])),
    [],
  );

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const handleEdit = (dept) => {
    setEditing(dept);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editing) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...data } : d)),
      );
      toast.success(`${data.name} updated`);
    } else {
      setDepartments((prev) => [...prev, { id: `d${Date.now()}`, ...data }]);
      toast.success(`${data.name} created`);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const toggleActive = (id) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)),
    );
  };

  return (
    <Layout
      title="Department Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Departments",
      }}
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 md:items-center">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code…"
              className="pas-input"
              style={{ paddingLeft: "35px" }}
            />
          </div>

          <button
            onClick={handleAdd}
            className="submit-btn md:justify-self-end"
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Add Department
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Code
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Head
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
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Inbox className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-[13px] font-semibold text-slate-700">
                        {departments.length === 0
                          ? "No departments yet"
                          : "No departments match your search"}
                      </p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">
                        {departments.length === 0
                          ? 'Click "Add Department" to create the first one.'
                          : "Try a different search term."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((dept) => {
                    const head = headMap[dept.headId];
                    return (
                      <tr
                        key={dept.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500
                              text-white flex items-center justify-center flex-shrink-0"
                            >
                              <Building2
                                className="w-4 h-4"
                                strokeWidth={2.2}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-medium text-slate-800">
                                {dept.name}
                              </span>
                              {dept.description && (
                                <span className="text-[10.5px] text-slate-500 truncate max-w-[280px]">
                                  {dept.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="hidden md:table-cell px-4 py-3">
                          {dept.code ? (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-mono font-semibold
                              bg-slate-100 text-slate-600 rounded"
                            >
                              {dept.code}
                            </span>
                          ) : (
                            <span className="text-[11.5px] text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        <td className="hidden md:table-cell px-4 py-3">
                          {head ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-sky-500
                                text-white text-[9px] font-semibold flex items-center justify-center flex-shrink-0"
                              >
                                {getInitials(head.name)}
                              </div>
                              <span className="text-[12px] text-slate-700 truncate max-w-[120px]">
                                {head.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11.5px] text-slate-400 italic">
                              Not assigned
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleActive(dept.id)}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                              text-[10.5px] font-semibold ring-1 transition-colors
                              ${
                                dept.active
                                  ? "bg-blue-50 text-blue-700 ring-blue-200 hover:bg-blue-100"
                                  : "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${dept.active ? "bg-blue-500" : "bg-slate-400"}`}
                            />
                            {dept.active ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleEdit(dept)}
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
          of {departments.length} departments
        </p>
      </div>

      <DepartmentFormModal
        open={modalOpen}
        department={editing}
        employees={MOCK_EMPLOYEES}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default DepartmentMaster;
