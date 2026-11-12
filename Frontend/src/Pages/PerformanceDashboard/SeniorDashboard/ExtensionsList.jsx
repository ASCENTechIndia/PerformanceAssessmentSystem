import { CalendarClock, Check, X, Inbox } from "lucide-react";
import { TASKS, formatDate, getEmployeeName } from "../performanceData";
import { StatusBadge } from "../dashboardcomponents/PerfomanceMetrics";

const ExtensionsList = ({ requests, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white
            flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]"
          >
            <CalendarClock className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-800">
              Extension Requests
            </h3>
            <p className="text-[10.5px] text-slate-400">
              Review deadline extension requests
            </p>
          </div>
        </div>
        <StatusBadge status="Pending" />
      </div>

      {requests.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[12px] text-slate-500">
            No pending extension requests.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {requests.map((req) => {
            const task = TASKS.find((t) => t.id === req.taskId);
            return (
              <div
                key={req.id}
                className="p-3 rounded-lg ring-1 ring-slate-100 hover:ring-slate-200 transition-colors"
              >
                <p className="text-[12.5px] font-semibold text-slate-800">
                  {task?.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {getEmployeeName(req.employeeId)}
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Requested deadline:{" "}
                  <b className="text-amber-700">
                    {formatDate(req.requestedDeadline)}
                  </b>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">{req.reason}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onApprove(req.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700
                      ring-1 ring-emerald-200 rounded-lg text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <Check className="w-3 h-3" strokeWidth={2.4} /> Approve
                  </button>
                  <button
                    onClick={() => onReject(req.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700
                      ring-1 ring-rose-200 rounded-lg text-[11px] font-semibold hover:bg-rose-100 transition-colors"
                  >
                    <X className="w-3 h-3" strokeWidth={2.4} /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExtensionsList;
