import { useState, useEffect } from "react";
import {
  X,
  FileText,
  Download,
  MessageSquare,
  Calendar,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../../../../apiClient"; // Adjust path if needed

// ext -> MIME type
const MIME_MAP = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

// Normalise FILETYPE / FILENAME into a clean extension: "jpg", "png", "pdf" ...
// Handles ".JPG", "jpg   " (Oracle CHAR padding), "image/jpeg", "application/pdf"
const getExt = (att) => {
  let raw = String(att?.FILETYPE || "")
    .trim()
    .toLowerCase();
  if (!raw && att?.FILENAME)
    raw = att.FILENAME.split(".").pop().trim().toLowerCase();
  raw = raw.replace(/^\./, "").replace(/^(image|application)\//, "");
  if (raw === "jpe") return "jpg";
  return raw;
};

// base64 string (or Buffer-JSON from node) -> Blob
const toBlob = (img, mime) => {
  let bytes;
  if (typeof img === "string") {
    // strip optional "data:...;base64," prefix and any whitespace / newlines
    const clean = img.replace(/^data:.*?;base64,/, "").replace(/\s/g, "");
    const bin = atob(clean);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } else if (img && Array.isArray(img.data)) {
    // oracledb BLOB returned as { type: "Buffer", data: [...] }
    bytes = new Uint8Array(img.data);
  } else {
    throw new Error("Unsupported file data format");
  }
  return new Blob([bytes], { type: mime });
};

const TaskProgressModal = ({ open, data, onClose }) => {
  const [attachment, setAttachment] = useState(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  // Fetch attachment details when modal opens
  useEffect(() => {
    if (!open || !data?.ATTACHMENT_ID) {
      setAttachment(null);
      return;
    }

    const fetchAttachment = async () => {
      setLoadingFile(true);
      try {
        const res = await apiClient.get(
          `/getAttachmentDetails?attachmentId=${data.ATTACHMENT_ID}&progressId=${data.TASKPROGRESS_ID}`,
        );
        if (res.success && res.data.length > 0) {
          setAttachment(res.data[0]);
        }
      } catch (err) {
        toast.error("Failed to load attachment");
      } finally {
        setLoadingFile(false);
      }
    };

    fetchAttachment();
  }, [open, data]);

  // Build a blob URL from the base64 (and clean it up afterwards)
  useEffect(() => {
    if (!attachment?.IMG) {
      setFileUrl("");
      return;
    }

    let url = "";
    try {
      const mime = MIME_MAP[getExt(attachment)] || "application/octet-stream";
      url = URL.createObjectURL(toBlob(attachment.IMG, mime));
      setFileUrl(url);
    } catch (err) {
      console.error("Could not decode attachment:", err);
      setFileUrl("");
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [attachment]);

  if (!open || !data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ext = getExt(attachment);
  const isPdf = ext === "pdf";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  // TASK_TITLE

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl ring-1 ring-slate-200 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Brand accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-800">
              Task Progress Details
            </h2>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Task Progress Id: {data.TASKPROGRESS_ID} • Assign Id: {data.TASKASSIGNID}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">
          {/* Meta Info */}
          <div className="flex items-center gap-6 text-[12.5px] text-slate-600 bg-slate-50 p-3 rounded-xl ring-1 ring-slate-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <b>Date:</b> {formatDate(data.ACTIONDATE)}
            </span>
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              <b>Status:</b> {data.STATUSNAME}
            </span>
          </div>

          {/* Remarks */}
          <div>
            <label className="pas-label flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-400" /> Remarks /
              Comments
            </label>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.ACTIONREMARK || "No remarks provided."}
            </div>
          </div>

          {/* Attachment Section */}
          {data.ATTACHMENT_ID && (
            <div>
              <label className="pas-label flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" /> Attachment
              </label>

              {loadingFile ? (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-[12px] text-slate-500 text-center">
                  Loading attachment...
                </div>
              ) : attachment ? (
                <div className="space-y-3">
                  {/* File Info Header */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[12.5px] font-semibold text-slate-800">
                          {attachment.FILENAME}
                        </p>
                        <p className="text-[10.5px] text-slate-500 uppercase">
                          {ext}
                        </p>
                      </div>
                    </div>
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        download={attachment.FILENAME}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    )}
                  </div>

                  {/* Preview Area */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center min-h-[200px]">
                    {!fileUrl ? (
                      <div className="text-center text-slate-500 text-sm p-4">
                        File data could not be read.
                      </div>
                    ) : isImage ? (
                      <img
                        src={fileUrl}
                        alt={attachment.FILENAME}
                        className="max-h-[300px] w-auto object-contain"
                      />
                    ) : isPdf ? (
                      <iframe
                        src={fileUrl}
                        title={attachment.FILENAME}
                        className="w-full h-[300px]"
                      />
                    ) : (
                      <div className="text-center text-slate-500 text-sm p-4">
                        Preview not available for this file type. Please
                        download.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-[12px] text-slate-500 text-center">
                  Attachment could not be loaded.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          <button onClick={onClose} className="submit-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskProgressModal;
