
import { X, CalendarDays, Clock, User, ClipboardList } from "lucide-react";

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const ViewTaskModal = ({ task, onClose }) => {
    if (!task) return null;

    const priorityStyles = {
        CRITICAL: "bg-rose-50 text-rose-700 ring-rose-200",
        HIGH: "bg-orange-50 text-orange-700 ring-orange-200",
        MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
        LOW: "bg-slate-50 text-slate-600 ring-slate-200",
    };

    const details = [
        {
            label: "Assignment ID",
            value: task.TASKASSIGNMENT_ID,
        },
        {
            label: "Task ID",
            value: task.TASK_ID,
        },
        {
            label: "Assigned To",
            //   value: task.ASSIGNEDTO ,
            value: "Test"
        },
        {
            label: "Assigned By",
            value: task.EMP_NAME,
        },
        {
            label: "Assigned Date",
            value: formatDate(task.ASSIGNEDDATE),
        },
        {
            label: "Start Date",
            value: formatDate(task.STARTDATE),
        },
        {
            label: "Due Date",
            value: formatDate(task.DUEDATE),
        },
        {
            label: "Expected Duration",
            value: task.TASK_EXCEPCTEDDAYS
                ? `${task.TASK_EXCEPCTEDDAYS} Day(s)`
                : "—",
        },
    ];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <ClipboardList className="w-5 h-5" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-slate-800">
                                Task Details
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Assignment {task.TASKASSIGNMENT_ID}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">

                    {/* Task Title and Description */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800">
                                {task.TASK_TITLE || "Untitled Task"}
                            </h3>

                            <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ring-1 ${priorityStyles[String(task.PRIORITY || "").toUpperCase()] ||
                                    "bg-slate-50 text-slate-600 ring-slate-200"
                                    }`}
                            >
                                {task.PRIORITY || "—"}
                            </span>

                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ring-1 bg-blue-50 text-blue-700 ring-blue-200">
                                {task.STATUSNAME || "—"}
                            </span>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">
                            {task.TASK_DESCRIPTION || "No description available."}
                        </p>
                    </div>

                    <div className="border-t border-slate-100" />

                    {/* Task Information */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ClipboardList className="w-4 h-4 text-blue-500" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Task Information
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {details.map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-slate-50 border border-slate-100 rounded-xl p-3"
                                >
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                                        {item.label}
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 break-words">
                                        {item.value ?? "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Date Information */}
                    {/* <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CalendarDays className="w-4 h-4 text-blue-500" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Schedule
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-slate-200 p-3">
                                <p className="text-[10px] text-slate-400 font-semibold">
                                    ASSIGNED
                                </p>
                                <p className="text-sm font-semibold text-slate-700 mt-1">
                                    {formatDate(task.ASSIGNEDDATE)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-3">
                                <p className="text-[10px] text-slate-400 font-semibold">
                                    START
                                </p>
                                <p className="text-sm font-semibold text-slate-700 mt-1">
                                    {formatDate(task.STARTDATE)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-3">
                                <p className="text-[10px] text-slate-400 font-semibold">
                                    DEADLINE
                                </p>
                                <p className="text-sm font-semibold text-slate-700 mt-1">
                                    {formatDate(task.DUEDATE)}
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-5 py-3 border-t border-slate-200 bg-slate-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTaskModal;
