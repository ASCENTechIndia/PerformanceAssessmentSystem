import { MessageCircle, Inbox } from "lucide-react";
import { StatusBadge } from "../dashboardcomponents/PerfomanceMetrics";

const QueriesList = ({ queries }) => {
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 text-white
          flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-slate-800">My Queries</h3>
          <p className="text-[10.5px] text-slate-400">
            Track questions and responses from your senior
          </p>
        </div>
      </div>

      {queries.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[12px] text-slate-500">No queries found.</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {queries.map((q) => (
            <div
              key={q.id}
              className="p-3 rounded-lg ring-1 ring-slate-100 hover:ring-slate-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  {q.taskId}
                </span>
                <StatusBadge status={q.status} />
              </div>
              <p className="text-[12px] text-slate-700 leading-relaxed">
                {q.question}
              </p>
              {q.response && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Senior's Response
                  </p>
                  <p className="text-[12px] text-emerald-800 mt-1 leading-relaxed">
                    {q.response}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueriesList;
