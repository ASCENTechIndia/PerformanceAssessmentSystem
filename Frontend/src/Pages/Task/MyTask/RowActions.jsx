import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  MessageSquare,
  XCircle,
  Clock,
  Play,
  Send,
} from "lucide-react";

const RowActions = ({ task, onAction }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  /* Junior-specific permissions per status */
  const canStart = ["Assigned", "Rejected"].includes(task.status);
  const canFinish = task.status === "In Progress";
  const canQuery = ["Assigned", "In Progress", "Rejected"].includes(
    task.status,
  );
  const canReject = ["Assigned", "In Progress"].includes(task.status);
  const canExtend = ["Assigned", "In Progress"].includes(task.status);

  const items = [
    { key: "view", label: "View details", icon: Eye, show: true },
    { key: "start", label: "Start working", icon: Play, show: canStart },
    { key: "finish", label: "Mark as finished", icon: Send, show: canFinish },
    { key: "query", label: "Raise query", icon: MessageSquare, show: canQuery },
    { key: "extend", label: "Request extension", icon: Clock, show: canExtend },
    {
      key: "reject",
      label: "Reject task",
      icon: XCircle,
      show: canReject,
      danger: true,
    },
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Task actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-52 origin-top-right rounded-xl bg-white ring-1 ring-slate-200 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />
          <div className="p-1">
            {items
              .filter((i) => i.show)
              .map(({ key, label, icon: Icon, danger }) => (
                <button
                  key={key}
                  onClick={() => {
                    setOpen(false);
                    onAction(key, task);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-[12.5px] font-medium transition-colors
                  ${
                    danger
                      ? "text-rose-600 hover:bg-rose-50"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <Icon
                    className="w-3.5 h-3.5 flex-shrink-0"
                    strokeWidth={2.2}
                  />
                  {label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RowActions;
