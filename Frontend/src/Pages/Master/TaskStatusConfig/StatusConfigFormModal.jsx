import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import apiClient from "../../../../apiClient";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const DEFAULTS = {
  IN_TASKSTATUS_CODE: "",
  IN_TASKSTATUS_NAME: "",
  IN_TASKSTATUS_BGCOLOR: "#E0F2FE",
  IN_TASKSTATUS_FORECOLOR: "#0369A1",
  IN_DISPLAYORDER: 1,
  IN_FINALSTATUS: false,
  IN_ISACTIVE: true,
};

const StatusConfigFormModal = ({ open, editing, onClose, onSaved }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.userId || "SYSTEM";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULTS });

  const bg = watch("IN_TASKSTATUS_BGCOLOR");
  const fg = watch("IN_TASKSTATUS_FORECOLOR");
  const previewName = watch("IN_TASKSTATUS_NAME");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      console.log("editing :", editing);
      // fill the form for editing
      reset({
        IN_TASKSTATUS_CODE: editing.STATUSCODE || "",
        IN_TASKSTATUS_NAME: editing.STATUSNAME || "",
        IN_TASKSTATUS_BGCOLOR: editing.BGCOLOR || "",
        IN_TASKSTATUS_FORECOLOR: editing.FORECOLOR || "",
        IN_DISPLAYORDER: Number(editing.DISPLAYORDER),
        IN_FINALSTATUS: Number(editing.FINALSTATUS),
        IN_ISACTIVE: Number(editing.ISACTIVE),
      });
    } else {
      reset(DEFAULTS);
    }
  }, [open, editing, reset]);

  const onSubmit = async (data) => {
    const isEdit = !!editing;

    const payload = {
      IN_MODE: isEdit ? "2" : "1",
      IN_TASKSTATUS_ID: isEdit ? Number(editing.STATUSID) : null,
      IN_TASKSTATUS_CODE: data.IN_TASKSTATUS_CODE.trim(),
      IN_TASKSTATUS_NAME: data.IN_TASKSTATUS_NAME.trim(),
      IN_TASKSTATUS_BGCOLOR: data.IN_TASKSTATUS_BGCOLOR || null,
      IN_TASKSTATUS_FORECOLOR: data.IN_TASKSTATUS_FORECOLOR || null,
      IN_DISPLAYORDER: Number(data.IN_DISPLAYORDER),
      IN_FINALSTATUS: data.IN_FINALSTATUS ? 1 : 0,
      IN_ISACTIVE: data.IN_ISACTIVE ? 1 : 0,
      IN_USERID: userId,
    };

    try {
      const res = await apiClient.post("/AOPT_TASKSTATUS_INSUPD", payload);

      const code = Number(res?.errorCode);
      const ok = res?.success === true && code === 9999;

      if (ok) {
        toast.success(
          res?.errorMessage || (isEdit ? "Status updated" : "Status created"),
        );
        onSaved?.();
        navigate("/master/HierarchyMapping");
      } else {
        toast.error(res?.errorMessage || res?.message || "Operation failed");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Request failed",
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editing ? "Edit Status Config" : "Add Status Config"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {editing
                ? "Update the details for this status."
                : "Fill in the details to create a new status."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-h-[75vh] space-y-4 overflow-y-auto px-6 py-5"
        >
          {/* Live preview */}
          <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">
              Live preview
            </span>
            <span
              className="rounded-md px-3 py-1 text-xs font-semibold shadow-sm"
              style={{
                backgroundColor: bg || "#e2e8f0",
                color: fg || "#334155",
              }}
            >
              {previewName || "Status Name"}
            </span>
          </div>

          {/* Code + Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Status Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. P, IP, C"
                {...register("IN_TASKSTATUS_CODE", {
                  required: "Status code is required",
                  maxLength: { value: 50, message: "Max 50 characters" },
                  pattern: {
                    value: /^[A-Za-z0-9_\-]+$/,
                    message: "Only letters, digits, _ and -",
                  },
                })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.IN_TASKSTATUS_CODE
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300"
                }`}
              />
              {errors.IN_TASKSTATUS_CODE && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.IN_TASKSTATUS_CODE.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Status Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pending"
                {...register("IN_TASKSTATUS_NAME", {
                  required: "Status name is required",
                  minLength: { value: 2, message: "Min 2 characters" },
                  maxLength: { value: 200, message: "Max 200 characters" },
                })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.IN_TASKSTATUS_NAME
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300"
                }`}
              />
              {errors.IN_TASKSTATUS_NAME && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.IN_TASKSTATUS_NAME.message}
                </p>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  {...register("IN_TASKSTATUS_BGCOLOR")}
                  className="h-9 w-12 cursor-pointer rounded border border-slate-300"
                />
                <input
                  type="text"
                  {...register("IN_TASKSTATUS_BGCOLOR")}
                  placeholder="#E0F2FE"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  {...register("IN_TASKSTATUS_FORECOLOR")}
                  className="h-9 w-12 cursor-pointer rounded border border-slate-300"
                />
                <input
                  type="text"
                  {...register("IN_TASKSTATUS_FORECOLOR")}
                  placeholder="#0369A1"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Display order */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Display Order <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              {...register("IN_DISPLAYORDER", {
                required: "Display order is required",
                valueAsNumber: true,
                min: { value: 0, message: "Must be 0 or more" },
                validate: (v) =>
                  Number.isInteger(Number(v)) || "Must be an integer",
              })}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.IN_DISPLAYORDER
                  ? "border-red-400 bg-red-50"
                  : "border-slate-300"
              }`}
            />
            {errors.IN_DISPLAYORDER && (
              <p className="mt-1 text-xs text-red-600">
                {errors.IN_DISPLAYORDER.message}
              </p>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                {...register("IN_ISACTIVE")}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Active
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                {...register("IN_FINALSTATUS")}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Final Status
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting
                ? "Saving..."
                : editing
                  ? "Update Status"
                  : "Create Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusConfigFormModal;
