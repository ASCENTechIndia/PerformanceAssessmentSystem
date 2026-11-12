import { MessageCircle, Inbox } from "lucide-react";
import { TASKS, getEmployeeName } from "../performanceData";
import { StatusBadge } from "../dashboardcomponents/PerfomanceMetrics";

const QueriesList = ({ queries, onRespond }) => {
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 text-white
            flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-800">
              Pending Queries
            </h3>
            <p className="text-[10.5px] text-slate-400">
              Questions raised by junior employees
            </p>
          </div>
        </div>
        <StatusBadge status="Pending" />
      </div>

      {queries.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[12px] text-slate-500">No pending queries.</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {queries.map((query) => {
            const task = TASKS.find((t) => t.id === query.taskId);
            return (
              <div
                key={query.id}
                className="p-3 rounded-lg ring-1 ring-slate-100 hover:ring-slate-200 transition-colors"
              >
                <p className="text-[12.5px] font-semibold text-slate-800">
                  {task?.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {getEmployeeName(query.employeeId)}
                </p>
                <p className="text-[11.5px] text-slate-600 mt-2 leading-relaxed">
                  {query.question}
                </p>
                <button
                  onClick={() => onRespond(query.id)}
                  className="mt-3 px-3 py-1.5 bg-violet-50 text-violet-700
                    ring-1 ring-violet-200 rounded-lg text-[11px] font-semibold hover:bg-violet-100 transition-colors"
                >
                  Respond to Query
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueriesList;
