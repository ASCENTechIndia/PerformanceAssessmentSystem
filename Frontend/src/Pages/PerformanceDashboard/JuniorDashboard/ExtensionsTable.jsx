import { CalendarClock, Inbox } from "lucide-react";
import { formatDate } from "../performanceData";
import { StatusBadge } from "../dashboardcomponents/PerfomanceMetrics";

const ExtensionsTable = ({ extensions }) => {
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white
          flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]"
        >
          <CalendarClock className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800">
            My Extension Requests
          </h3>
          <p className="text-[10.5px] text-slate-400">
            Track deadline extension approvals
          </p>
        </div>
      </div>

      {extensions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[12px] text-slate-500">
            No extension requests found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Task ID
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Requested Deadline
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Reason
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {extensions.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-[12px] font-mono font-semibold text-slate-700">
                    {req.taskId}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-600">
                    {formatDate(req.requestedDeadline)}
                  </td>
                  <td
                    className="px-4 py-3 text-[12px] text-slate-500 max-w-[280px] truncate"
                    title={req.reason}
                  >
                    {req.reason}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExtensionsTable;
