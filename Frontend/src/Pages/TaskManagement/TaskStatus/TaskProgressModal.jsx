import {
  X,
  FileText,
  Image as ImageIcon,
  Download,
  User,
  Calendar,
} from "lucide-react";

const TaskProgressModal = ({ open, data, onClose }) => {
  if (!open || !data) return null;

  const isImage = data.fileType?.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl ring-1 ring-slate-200 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Brand accent strip */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-800">
              Task Progress Details
            </h2>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {data.taskAssignId} • {data.progressId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-5">
          {/* Task Summary */}
          <div className="p-4 rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <h3 className="text-[14px] font-bold text-slate-800">
              {data.taskTitle}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-[11.5px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Action By: <b>{data.actionBy}</b>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Date: <b>{data.actionDate}</b>
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="pas-label">Task Status</label>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ring-1 ${data.statusColor}`}
            >
              {data.statusName}
            </span>
          </div>

          {/* Remarks */}
          <div>
            <label className="pas-label">Remarks / Comments</label>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.comment}
            </div>
          </div>

          {/* Attachments */}
          {data.fileName && (
            <div>
              <label className="pas-label">Attachment</label>
              {isImage ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 relative group">
                  <img
                    src={data.fileDoc}
                    alt={data.fileName}
                    className="w-full h-64 object-contain bg-slate-50"
                  />
                  <a
                    href={data.fileDoc}
                    download={data.fileName}
                    className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Download Image"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">
                        {data.fileName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {data.fileType}
                      </p>
                    </div>
                  </div>
                  <a
                    href={data.fileDoc}
                    download={data.fileName}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          <button onClick={onClose} className="submit-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskProgressModal;
