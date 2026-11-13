import { ArrowLeft, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaskSubmissionCard = ({ taskId, taskTitle }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-slate-800">
            Task Submission
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                Task ID
              </p>
              <p className="text-[13px] font-medium text-slate-800">{taskId}</p>
            </div>
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                Task Title
              </p>
              <p className="text-[13px] font-medium text-slate-800">
                {taskTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        // onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
          text-[12px] font-semibold text-slate-600 bg-white border border-slate-200
          hover:bg-slate-50 hover:border-slate-300 transition-colors flex-shrink-0"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
        Back to Pending Approvals
      </button>
    </div>
  );
};

export default TaskSubmissionCard;
