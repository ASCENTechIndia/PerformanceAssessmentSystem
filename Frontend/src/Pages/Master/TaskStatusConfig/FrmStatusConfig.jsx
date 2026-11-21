import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import StatusConfigFormModal from "./StatusConfigFormModal";
import apiClient from "../../../../apiClient";

const FrmStatusConfig = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/getStatusConfigList");
      if (res?.success && Array.isArray(res.data)) {
        setStatuses(res.data);
      } else {
        setStatuses([]);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load statuses",
      );
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page load
  useEffect(() => {
    fetchStatuses();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return statuses;
    return statuses.filter(
      (s) =>
        String(s.STATUSCODE ?? "")
          .toLowerCase()
          .includes(q) ||
        String(s.STATUSNAME ?? "")
          .toLowerCase()
          .includes(q),
    );
  }, [statuses, search]);

  const stats = useMemo(
    () => ({
      total: statuses.length,
      active: statuses.filter((s) => Number(s.ISACTIVE ?? 0) === 1).length,
      final: statuses.filter((s) => Number(s.FINALSTATUS ?? 0) === 1).length,
    }),
    [statuses],
  );

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (s) => {
    setEditing(s);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    fetchStatuses(); // Refresh the list after saving
  };

  return (
    <Layout
      title="Status Config"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Status Config",
      }}
    >
      <div className="space-y-5">
        {/* ===== Header ===== */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button type="button" onClick={handleAdd} className="submit-btn">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Status Config
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total Statuses" value={stats.total} tone="slate" />
          <StatCard label="Active" value={stats.active} tone="green" />
          <StatCard label="Final Statuses" value={stats.final} tone="blue" />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
            <div className="relative flex-1 min-w-[220px]">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by code or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <span className="text-xs text-slate-500">
              {filtered.length} of {statuses.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Preview</th>
                  <th className="px-4 py-3 text-left font-semibold">Code</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Order</th>
                  <th className="px-4 py-3 text-left font-semibold">Final</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
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
                        Loading statuses...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <svg
                            className="h-6 w-6 text-slate-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 0v12h6V4H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {search ? "No matching statuses" : "No statuses yet"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {search
                            ? "Try a different search term."
                            : "Click 'Add Status Config' to create your first status."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const isActive = Number(s.ISACTIVE ?? 0) === 1;
                    const isFinal = Number(s.FINALSTATUS ?? 0) === 1;

                    return (
                      <tr key={s.STATUSID} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span
                            className="inline-block rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm"
                            style={{
                              backgroundColor: s.BGCOLOR || "#e2e8f0",
                              color: s.FORECOLOR || "#334155",
                            }}
                          >
                            {s.STATUSNAME || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700">
                          {s.STATUSCODE || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {s.STATUSNAME || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {s.DISPLAYORDER ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          {isFinal ? (
                            <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                              Final
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(s)}
                              className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              Edit
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
      </div>

      {/* ===== Popup ===== */}
      <StatusConfigFormModal
        open={formOpen}
        editing={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSaved={handleSaved}
      />
    </Layout>
  );
};

const StatCard = ({ label, value, tone }) => {
  const tones = {
    slate: "from-slate-50 to-white border-slate-200 text-slate-700",
    green: "from-green-50 to-white border-green-200 text-green-700",
    blue: "from-blue-50 to-white border-blue-200 text-blue-700",
  };
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-4 shadow-sm ${
        tones[tone] || tones.slate
      }`}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
};

export default FrmStatusConfig;
