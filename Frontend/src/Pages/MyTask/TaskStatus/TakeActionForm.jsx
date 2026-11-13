import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, X, FileText, Check } from "lucide-react";

const STATUS_OPTIONS = [
  "New",
  "In Progress",
  "Rework",
  "Submitted",
  "Completed",
];

const TakeActionForm = ({
  actionBy = "Rajesh Kulkarni (you)",
  actionDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  onSubmitAction,
}) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      status: "In Progress",
      remarks: "",
    },
    mode: "onBlur",
  });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (data) => {
    await new Promise((r) => setTimeout(r, 500));
    onSubmitAction({ ...data, attachments: files });
  };

  return (
    <div className="bg-white rounded-xl ring-1 ring-blue-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-blue-50/20">
        <h2 className="text-[15px] font-bold text-slate-800">Take Action</h2>
      </div>

      <form onSubmit={handleSubmit(submit)} className="p-5 space-y-5">
        {/* Top Row: Action By, Date, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="pas-label">Action By</label>
            <input
              type="text"
              readOnly
              value={actionBy}
              className="pas-input bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="pas-label">Action Date</label>
            <input
              type="text"
              readOnly
              value={actionDate}
              className="pas-input bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="status" className="pas-label">
              Current Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="status"
              className="pas-input"
              aria-invalid={!!errors.status}
              {...register("status", { required: "Status is required" })}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="pas-error">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks" className="pas-label">
            Remarks <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="remarks"
            rows={4}
            placeholder="Enter your remarks here…"
            className="pas-input resize-none"
            aria-invalid={!!errors.remarks}
            {...register("remarks", {
              required: "Remarks are required",
              minLength: { value: 10, message: "At least 10 characters" },
            })}
          />
          {errors.remarks && (
            <p className="pas-error">{errors.remarks.message}</p>
          )}
        </div>

        {/* Attachments */}
        <div>
          <label className="pas-label">Attachments</label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl
              border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30
              cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <p className="text-[12px] text-slate-600">
              <span className="font-semibold text-slate-800">
                Drag files here
              </span>{" "}
              or <span className="text-blue-600 font-semibold">browse</span>
            </p>
            <p className="text-[10px] text-slate-400 ml-2">
              PDF, JPG, PNG, XLSX up to 10 MB each
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                    bg-slate-50 border border-slate-200 text-[11.5px]"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">
                    {file.name}
                  </span>
                  <span className="text-slate-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-0.5 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn disabled:opacity-50"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeActionForm;
