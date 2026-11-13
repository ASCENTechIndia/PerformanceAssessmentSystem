import {
  Clock,
  User,
  CalendarDays,
  ArrowRight,
  Check,
  X,
  FileText,
  MessageSquare,
} from "lucide-react";

const formatFullDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const timeAgo = (iso) => {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const waitLevel = (hours) =>
  hours >= 48 ? "urgent" : hours >= 24 ? "warn" : "fresh";

const SLA = {
  fresh: {
    chip: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
  warn: {
    chip: "bg-amber-50  text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  urgent: {
    chip: "bg-rose-50   text-rose-700  ring-rose-200",
    dot: "bg-rose-500",
  },
};

const RequestCard = ({ request, onApprove, onReject }) => {
  const waitedHours = Math.floor(
    (Date.now() - new Date(request.requestedAt).getTime()) / 3_600_000,
  );
  const sla = SLA[waitLevel(waitedHours)];

  const newDeadline = new Date(
    new Date(request.currentDeadline).getTime() +
      request.requestedExtraDays * 86_400_000,
  ).toISOString();

  return (
    <div
      className="group p-4 rounded-xl bg-white ring-1 ring-slate-200
      hover:ring-sky-200 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]
      transition-all duration-150"
    >
      {/* Top row: request ID + SLA + task ref */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded
          text-[10px] font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200"
        >
          <Clock className="w-2.5 h-2.5" />
          Extension
        </span>
        <span className="text-[10.5px] font-mono font-semibold text-slate-400">
          {request.id}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded
          text-[10px] font-semibold ring-1 ${sla.chip}`}
        >
          <span className={`w-1 h-1 rounded-full ${sla.dot}`} />
          {timeAgo(request.requestedAt)}
        </span>
      </div>

      {/* Task title */}
      <p
        className="text-[14px] font-semibold text-slate-800 truncate"
        title={request.taskTitle}
      >
        {request.taskTitle}
      </p>

      {/* Employee + task metadata */}
      <div className="flex items-center gap-2 mt-1.5 text-[11.5px] text-slate-500 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-sky-500
            text-white text-[9px] font-semibold flex items-center justify-center"
          >
            {getInitials(request.employee)}
          </div>
          <span className="text-slate-700 font-medium">{request.employee}</span>
        </div>
        <span className="text-slate-300">·</span>
        <span>{request.taskType}</span>
        <span className="text-slate-300">·</span>
        <span className="font-mono text-[10.5px] text-slate-400">
          {request.taskId}
        </span>
      </div>

      {/* Reason block */}
      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-slate-700 italic leading-relaxed">
            "{request.reason}"
          </p>
        </div>
      </div>

      {/* Deadline transition — the KEY info */}
      <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-sky-50 via-white to-indigo-50 ring-1 ring-sky-100">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-500">
              Current
            </p>
            <p className="text-[12.5px] font-semibold text-slate-700">
              {formatFullDate(request.currentDeadline)}
            </p>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-sky-500 flex-shrink-0" />

        <div className="flex items-center gap-2">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-wider text-sky-700">
              Requested
            </p>
            <p className="text-[12.5px] font-semibold text-sky-800">
              {formatFullDate(newDeadline)}
            </p>
          </div>
          <span
            className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded
            text-[10px] font-bold bg-sky-100 text-sky-700"
          >
            +{request.requestedExtraDays}d
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={() => onReject(request)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
            text-[12px] font-semibold text-rose-700 bg-rose-50 ring-1 ring-rose-200
            hover:bg-rose-100 hover:ring-rose-300 active:scale-[0.98]
            transition-all duration-150"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.4} />
          Reject
        </button>
        <button
          onClick={() => onApprove(request)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
            text-[12px] font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200
            hover:bg-emerald-100 hover:ring-emerald-300 active:scale-[0.98]
            transition-all duration-150"
        >
          <Check className="w-3.5 h-3.5" strokeWidth={2.4} />
          Approve
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
