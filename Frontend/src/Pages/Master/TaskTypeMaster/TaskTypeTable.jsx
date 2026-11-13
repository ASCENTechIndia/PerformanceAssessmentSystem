import { Inbox, Eye, Pencil, Trash2 } from "lucide-react";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TaskTypeTable = ({ taskTypes, onView, onEdit, onDelete }) => {
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
                Task Type
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Created By
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Created Date
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {taskTypes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Inbox className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-[13px] font-semibold text-slate-700">
                    No task types match your filters
                  </p>
                  <p className="text-[11.5px] text-slate-500 mt-0.5">
                    Try clearing filters or changing the search terms.
                  </p>
                </td>
              </tr>
            ) : (
              taskTypes.map((t, idx) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-3 py-3 text-[11.5px] font-mono text-slate-400">
                    {String(idx + 1).padStart(2, "0")}
                  </td>

                  <td className="px-3 py-3">
                    <span className="text-[13px] font-semibold text-slate-800">
                      {t.name}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className="text-[12px] text-slate-600 truncate max-w-[260px] block"
                      title={t.description}
                    >
                      {t.description || (
                        <span className="text-[11px] text-slate-400 italic">
                          —
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                      text-[10.5px] font-semibold ring-1
                      ${
                        t.active
                          ? "bg-blue-50 text-blue-700 ring-blue-200"
                          : "bg-slate-100 text-slate-500 ring-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${t.active ? "bg-blue-500" : "bg-slate-400"}`}
                      />
                      {t.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                    {t.createdBy}
                  </td>

                  <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-nowrap">
                    {formatDate(t.createdAt)}
                  </td>

                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onView(t)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="View details"
                        aria-label="View details"
                      >
                        <Eye className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTypeTable;
