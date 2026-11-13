import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Inbox,
  Pencil,
  UserCog,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import DesignationFormModal from "./DesignationFormModal";

/* ---------- Dummy data ---------- */
const MOCK_DESIGNATIONS = [
  {
    id: "g1",
    name: "HOD",
    level: 1,
    adminAccess: false,
    description: "Head of Department",
    active: true,
  },
  {
    id: "g2",
    name: "Senior Engineer",
    level: 2,
    adminAccess: false,
    description: "Manages junior engineers",
    active: true,
  },
  {
    id: "g3",
    name: "Junior Engineer",
    level: 3,
    adminAccess: false,
    description: "Executes assigned tasks",
    active: true,
  },
  {
    id: "g4",
    name: "System Admin",
    level: 2,
    adminAccess: true,
    description: "Maintains masters and users",
    active: true,
  },
  {
    id: "g5",
    name: "Trainee",
    level: 5,
    adminAccess: false,
    description: "Under probation",
    active: true,
  },
];

const LEVEL_LABEL = {
  1: { text: "L1 · Top", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
  2: {
    text: "L2 · Senior",
    cls: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  3: { text: "L3 · Middle", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  4: { text: "L4 · Junior", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  5: { text: "L5 · Entry", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
};

const DesignationMaster = () => {
  const [designations, setDesignations] = useState(MOCK_DESIGNATIONS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return designations.filter((d) => !q || d.name.toLowerCase().includes(q));
  }, [designations, search]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const handleEdit = (d) => {
    setEditing(d);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editing) {
      setDesignations((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...data } : d)),
      );
      toast.success(`${data.name} updated`);
    } else {
      setDesignations((prev) => [...prev, { id: `g${Date.now()}`, ...data }]);
      toast.success(`${data.name} created`);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const toggleActive = (id) => {
    setDesignations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)),
    );
  };

  return (
    <Layout
      title="Designation Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Designations",
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
              placeholder="Search designation…"
              className="pas-input"
              style={{ paddingLeft: "35px" }}
            />
          </div>

          <button
            onClick={handleAdd}
            className="submit-btn md:justify-self-end"
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Add Designation
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Level
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Admin Access
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
                        {designations.length === 0
                          ? "No designations yet"
                          : "No designations match your search"}
                      </p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">
                        {designations.length === 0
                          ? 'Click "Add Designation" to create the first one.'
                          : "Try a different search term."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => {
                    const level = LEVEL_LABEL[d.level] || LEVEL_LABEL[3];
                    return (
                      <tr
                        key={d.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500
                              text-white flex items-center justify-center flex-shrink-0"
                            >
                              <UserCog className="w-4 h-4" strokeWidth={2.2} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-medium text-slate-800">
                                {d.name}
                              </span>
                              {d.description && (
                                <span className="text-[10.5px] text-slate-500 truncate max-w-[280px]">
                                  {d.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10.5px] font-semibold rounded-full ring-1 ${level.cls}`}
                          >
                            {level.text}
                          </span>
                        </td>

                        <td className="hidden md:table-cell px-4 py-3">
                          {d.adminAccess ? (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10.5px] font-semibold
                              bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 rounded-full"
                            >
                              <ShieldCheck
                                className="w-2.5 h-2.5"
                                strokeWidth={2.4}
                              />
                              Yes
                            </span>
                          ) : (
                            <span className="text-[11.5px] text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleActive(d.id)}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                              text-[10.5px] font-semibold ring-1 transition-colors
                              ${
                                d.active
                                  ? "bg-blue-50 text-blue-700 ring-blue-200 hover:bg-blue-100"
                                  : "bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${d.active ? "bg-blue-500" : "bg-slate-400"}`}
                            />
                            {d.active ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleEdit(d)}
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
          of {designations.length} designations
        </p>
      </div>

      <DesignationFormModal
        open={modalOpen}
        designation={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default DesignationMaster;
