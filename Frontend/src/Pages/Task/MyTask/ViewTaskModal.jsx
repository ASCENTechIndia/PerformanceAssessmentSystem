
import React from "react";
import {
    X,
    ClipboardList,
    CalendarDays,
    Hash,
    Flag,
    Clock,
    CheckCircle2,
    User,
    FileText,
    Paperclip,
    Download,
    FileImage,
    File,
} from "lucide-react";

const ViewTaskModal = ({ open, task, onClose }) => {
    if (!open || !task) return null;

    const formatDate = (date) => {
        if (!date) return "—";

        const [year, month, day] = date.split("-");

        if (!year || !month || !day) return date;

        return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const statusStyles = {
        Assigned: "bg-slate-100 text-slate-700 ring-slate-200",
        "In Progress": "bg-sky-50 text-sky-700 ring-sky-200",
        Submitted: "bg-amber-50 text-amber-700 ring-amber-200",
        Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
        Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };

    const priorityStyles = {
        High: "bg-rose-50 text-rose-700 ring-rose-200",
        Medium: "bg-amber-50 text-amber-700 ring-amber-200",
        Low: "bg-slate-50 text-slate-600 ring-slate-200",
    };

    const DetailItem = ({ label, value, icon: Icon }) => (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 text-[10.5px] font-medium text-slate-500 mb-2">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </div>

            <p className="text-[12.5px] font-semibold text-slate-800 break-words">
                {value || "—"}
            </p>
        </div>
    );

    const attachments = task.attachments || [];

    const formatFileSize = (bytes) => {
        if (!bytes) return "—";

        if (bytes < 1024) return `${bytes} B`;

        if (bytes < 1048576) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    const getFileIcon = (fileName) => {
        const extension = fileName?.split(".").pop()?.toLowerCase();

        if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
            return FileImage;
        }

        if (extension === "pdf") {
            return FileText;
        }

        return File;
    };

    const handleDownload = (file) => {
        const link = document.createElement("a");

        link.href = file.url;
        link.download = file.name;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl ring-1 ring-slate-200
        shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
            >
                {/* Gradient top border */}
                <div className="h-[3px] w-full bg-gradient-to-r from-blue-300 via-blue-500 to-indigo-600" />

                {/* Header */}
                <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ClipboardList className="w-5 h-5" strokeWidth={2.2} />
                        </div>

                        <div>
                            <p className="text-[14.5px] font-semibold text-slate-800">
                                Task Details
                            </p>

                            <p className="text-[11.5px] text-slate-500 mt-0.5">
                                View complete task information
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Task Summary */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">

                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10.5px] font-mono font-semibold text-slate-400">
                            {task.id}
                        </p>

                        <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${statusStyles[task.status] ||
                                "bg-slate-100 text-slate-700 ring-slate-200"
                                }`}
                        >
                            <CheckCircle2 className="w-3 h-3" />
                            {task.status}
                        </span>
                    </div>

                    <p className="text-[13.5px] font-semibold text-slate-800 mt-1">
                        {task.title}
                    </p>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4 max-h-[55vh] overflow-y-auto">

                    {/* General Information */}
                    <div>
                        <h4 className="text-[11.5px] font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
                            General Information
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            <DetailItem
                                label="Task Type"
                                value={task.type}
                                icon={FileText}
                            />

                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="flex items-center gap-2 text-[10.5px] font-medium text-slate-500 mb-2">
                                    <Flag className="w-3.5 h-3.5" />
                                    Priority
                                </div>

                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold ring-1 ${priorityStyles[task.priority] ||
                                        "bg-slate-50 text-slate-600 ring-slate-200"
                                        }`}
                                >
                                    {task.priority || "—"}
                                </span>
                            </div>

                            <DetailItem
                                label="Assigned Date"
                                value={formatDate(task.assigned)}
                                icon={CalendarDays}
                            />

                            <DetailItem
                                label="Due Date"
                                value={formatDate(task.due)}
                                icon={Clock}
                            />

                        </div>
                    </div>

                    {/* Additional Information */}
                    {(task.description || task.assignedTo) && (
                        <div>
                            <h4 className="text-[11.5px] font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-violet-500" />
                                Additional Information
                            </h4>

                            <div className="space-y-3">

                                {task.assignedTo && (
                                    <DetailItem
                                        label="Assigned To"
                                        value={task.assignedTo}
                                        icon={User}
                                    />
                                )}

                                {task.description && (
                                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                                        <p className="text-[10.5px] font-medium text-slate-500 mb-2">
                                            Description
                                        </p>

                                        <p className="text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {task.description}
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {/* Attached Documents */}
                    <div>
                        <h4 className="text-[11.5px] font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                            Attached Documents

                            <span className="text-[10px] font-medium text-slate-400">
                                ({attachments.length})
                            </span>
                        </h4>

                        {attachments.length > 0 ? (
                            <div className="space-y-2">

                                {attachments.map((file, index) => {
                                    const FileIcon = getFileIcon(file.name);

                                    return (
                                        <div
                                            key={file.id || index}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                                        >
                                            {/* File Icon */}
                                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                <FileIcon className="w-4 h-4" strokeWidth={2} />
                                            </div>

                                            {/* File Details */}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className="text-[12px] font-medium text-slate-800 truncate"
                                                    title={file.name}
                                                >
                                                    {file.name}
                                                </p>

                                                <p className="text-[10.5px] text-slate-500 mt-0.5">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>

                                            {/* Download */}
                                            <button
                                                type="button"
                                                onClick={() => handleDownload(file)}
                                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0"
                                                title="Download document"
                                                aria-label={`Download ${file.name}`}
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                    <Paperclip className="w-4 h-4 text-slate-400" />
                                </div>

                                <p className="text-[11.5px] font-medium text-slate-600">
                                    No documents attached
                                </p>

                                <p className="text-[10.5px] text-slate-400 mt-0.5">
                                    No files are available for this task.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">

                    <button
                        type="button"
                        onClick={onClose}
                        className="reset-btn"
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ViewTaskModal;
