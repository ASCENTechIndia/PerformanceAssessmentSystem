import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ClipboardList,
  Upload,
  X,
  FileText,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiClient from "../../../../apiClient";

const TaskStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?.userId
  const { setLoading } = useLoader();

  const task = location.state?.task;

  // States
  const [statusOptions, setStatusOptions] = useState([]);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Form Hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      status: "",
      remarks: "",
    },
    mode: "onBlur",
  });

  // Fetch Status Dropdown
  const fetchStatusDropdown = async () => {
    try {
      const response = await apiClient.get("/getStatusDropdown");
      if (response.success && Array.isArray(response.data)) {
        const formatted = response.data.map((item) => ({
          label: item.STATUSNAME,
          value: String(item.STATUSID),
        }));
        setStatusOptions(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to fetch Status dropdown options");
    }
  };

  useEffect(() => {
    fetchStatusDropdown();
  }, []);

  // Set default status when options load and task has a status
  useEffect(() => {
    if (statusOptions.length && task?.STATUSNAME) {
      const matchedOption = statusOptions.find(
        (opt) => opt.label.toLowerCase() === task.STATUSNAME.toLowerCase(),
      );
      if (matchedOption) {
        setValue("status", matchedOption.value, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [statusOptions, task, setValue]);

  // File Handlers
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than or equal to 5 MB");
      e.target.value = "";
      return;
    }

    setFiles([selected]);
    e.target.value = ""; // Allow selecting same file again
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Convert uploaded file to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const file = files[0];
      let fileBase64 = "";
      let fileName = "";
      let fileType = "";

      if (file) {
        fileBase64 = await convertFileToBase64(file);
        fileName = file.name;
        fileType = `.${file.name.split(".").pop().toLowerCase()}`;
      }


      const payload = {
        IN_TASKASSIGNID: Number(task?.taskAssignId),
        IN_STATUSID: Number(data.status),
        IN_ACTIONBY: Number(userId),
        IN_userid: String(userId),
        IN_COMMENT: data.remarks,
        IN_FILENAME: fileName,
        IN_FILEDOC: fileBase64,
        IN_FILETYPE: fileType,
      };
      const response = await apiClient.post("/AOPT_TASK_PROGRESS_upd", payload);

      if (
        response.success &&
        (response.errorCode === 9999 || response.errorCode === 0)
      ) {
        toast.success(response.errorMessage || "Task updated successfully");
        reset();
        setFiles([]);
        navigate("/task-management/tasks");
      } else {
        toast.error(response.errorMessage || "Failed to update task");
      }
    } catch (error) {
      console.error("Task Progress Error:", error);
      toast.error(error.message || "Failed to submit task progress");
    } finally {
      setLoading(false);
    }
  };

  // Fallback UI if page is refreshed (state is lost)
  if (!task) {
    return (
      <Layout title="Task Progress">
        <div className="bg-white rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
          <p className="text-sm text-slate-600">
            Task information not found. Please go back and select a task again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 text-white text-sm font-semibold bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Task Progress"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Task Progress",
      }}
    >
      <div className="space-y-4 mx-auto">
        {/* Breadcrumb Inline */}
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
          <span>Task Progress</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">
            {task?.id || task?.TASK_ID}
          </span>
        </div>

        {/* ================= TASK SUBMISSION CARD ================= */}
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
                  <p className="text-[13px] font-medium text-slate-800">
                    {task?.id || task?.TASK_ID || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                    Task Title
                  </p>
                  <p className="text-[13px] font-medium text-slate-800">
                    {task?.title || task?.TASK_TITLE || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
              text-[12px] font-semibold text-slate-600 bg-white border border-slate-200
              hover:bg-slate-50 hover:border-slate-300 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
            Go Back
          </button>
        </div>

        {/* ================= TAKE ACTION FORM ================= */}
        <div className="bg-white rounded-xl ring-1 ring-blue-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-blue-50/20">
            <h2 className="text-[15px] font-bold text-slate-800">
              Take Action
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                  <option value="">Select Status</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="pas-error">{errors.status.message}</p>
                )}
              </div>
            </div>

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
                  PDF, JPG, PNG, XLSX up to 5 MB each
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
      </div>
    </Layout>
  );
};

export default TaskStatus;
