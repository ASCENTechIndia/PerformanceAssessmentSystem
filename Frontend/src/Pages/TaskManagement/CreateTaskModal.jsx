import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  FileText,
  ClipboardList,
  Save,
  RotateCcw,
  Lock,
} from "lucide-react";

const TASK_TYPE_OPTIONS = [
  "Inspection",
  "Audit",
  "Review",
  "Report",
  "Site Visit",
];
const DURATION_OPTIONS = [1, 3, 7, 15, 30, 60, 90];

const CreateTaskModal = ({
  open,
  onClose,
  onSubmit,
  parentTaskOptions,
  createdBy = "Shri Kumar",
  nextTaskId = "T-NEW",
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      taskType: "",
      expectedDuration: "",
      parent: "",
      hasSubTask: false,
      completionCriteria: "",
      active: true,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        description: "",
        taskType: "",
        expectedDuration: "",
        parent: "",
        hasSubTask: false,
        completionCriteria: "",
        active: true,
      });
    }
  }, [open, reset]);

  if (!open) return null;

  const now = new Date();
  const createdOn = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const createdTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const submit = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit({
      ...data,
      createdBy,
      createdAt: now.toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl ring-1 ring-slate-200
        shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                Create task
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                New task ID will be{" "}
                <span className="font-mono font-semibold text-slate-700">
                  {nextTaskId}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(submit)}
          className="px-5 py-4 space-y-4 max-h-[65vh] overflow-y-auto"
        >
          {/* ────── Fancy Task Title ────── */}
          <div>
            <label htmlFor="title" className="pas-label">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <div
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500
                  text-white flex items-center justify-center shadow-[0_3px_8px_-2px_rgba(59,130,246,0.5)]
                  transition-transform duration-200 group-focus-within:scale-105"
                >
                  <FileText className="w-4 h-4" strokeWidth={2.2} />
                </div>
              </div>
              <input
                id="title"
                type="text"
                placeholder="Task Title"
                className={`w-full pl-16 pr-4 py-3.5 text-[15px] font-semibold text-slate-800
                  bg-gradient-to-br from-white to-blue-50/30 rounded-xl
                  placeholder:text-slate-400 placeholder:font-normal
                  border-2 transition-all duration-200 outline-none
                  ${
                    errors.title
                      ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/15"
                      : "border-slate-200 hover:border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15"
                  }`}
                aria-invalid={!!errors.title}
                autoFocus
                {...register("title", {
                  required: "Task title is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                  maxLength: { value: 120, message: "Max 120 characters" },
                })}
              />
            </div>
            {errors.title && (
              <p className="pas-error">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="pas-label">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe what needs to be done, scope, expected outcome…"
              className="pas-input resize-none"
              aria-invalid={!!errors.description}
              {...register("description", {
                required: "Description is required",
                minLength: { value: 20, message: "At least 20 characters" },
              })}
            />
            {errors.description && (
              <p className="pas-error">{errors.description.message}</p>
            )}
          </div>

          {/* Row: Task Type + Expected Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="taskType" className="pas-label">
                Task Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="taskType"
                className="pas-input"
                aria-invalid={!!errors.taskType}
                {...register("taskType", { required: "Task type is required" })}
              >
                <option value="">Select task type…</option>
                {TASK_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.taskType && (
                <p className="pas-error">{errors.taskType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="expectedDuration" className="pas-label">
                Expected Duration <span className="text-rose-500">*</span>
              </label>
              <select
                id="expectedDuration"
                className="pas-input"
                aria-invalid={!!errors.expectedDuration}
                {...register("expectedDuration", {
                  required: "Expected duration is required",
                })}
              >
                <option value="">Select duration…</option>
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? "day" : "days"}
                  </option>
                ))}
              </select>
              {errors.expectedDuration && (
                <p className="pas-error">{errors.expectedDuration.message}</p>
              )}
            </div>
          </div>

          {/* Row: Parent Task + Has Sub-Task toggle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="parent" className="pas-label">
                Parent Task{" "}
                <span className="text-slate-400 normal-case font-normal">
                  (optional)
                </span>
              </label>
              <select id="parent" className="pas-input" {...register("parent")}>
                <option value="">None (top-level)</option>
                {parentTaskOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="pas-label">
                Has Sub-Task <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="hasSubTask"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`w-full flex items-center justify-between gap-3
                      px-3.5 py-2.5 rounded-xl border transition-all duration-150
                      ${
                        field.value
                          ? "bg-violet-50/60 border-violet-200 hover:bg-violet-50"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <span
                      className={`text-[13px] font-semibold
                      ${field.value ? "text-violet-800" : "text-slate-700"}`}
                    >
                      {field.value ? "Yes — will have sub-tasks" : "No"}
                    </span>
                    <span
                      className={`relative inline-flex h-5 w-9 items-center rounded-full
                      transition-colors duration-150 flex-shrink-0
                      ${field.value ? "bg-violet-500" : "bg-slate-300"}`}
                    >
                      <span
                        className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-sm
                        transition-transform duration-200
                        ${field.value ? "translate-x-[19px]" : "translate-x-[3px]"}`}
                      />
                    </span>
                  </button>
                )}
              />
            </div>
          </div>

          {/* Completion Criteria */}
          <div>
            <label htmlFor="completionCriteria" className="pas-label">
              Completion Criteria{" "}
              <span className="text-slate-400 normal-case font-normal">
                (optional)
              </span>
            </label>
            <textarea
              id="completionCriteria"
              rows={2}
              placeholder="What defines a completed task? Any must-have deliverables…"
              className="pas-input resize-none"
              {...register("completionCriteria", {
                maxLength: { value: 500, message: "Max 500 characters" },
              })}
            />
            {errors.completionCriteria && (
              <p className="pas-error">{errors.completionCriteria.message}</p>
            )}
          </div>

          {/* Auto-filled meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Created By
                </p>
              </div>
              <p className="text-[12.5px] font-semibold text-slate-800">
                {createdBy}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                  Created Date &amp; Time
                </p>
              </div>
              <p className="text-[12.5px] font-semibold text-slate-800">
                {createdOn} · {createdTime}
              </p>
            </div>
          </div>

          {/* Status toggle */}
          <div>
            <label className="pas-label">
              Status <span className="text-rose-500">*</span>
            </label>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`w-full flex items-center justify-between gap-3
                    px-3.5 py-2.5 rounded-xl border transition-all duration-150
                    ${
                      field.value
                        ? "bg-blue-50/60 border-blue-200 hover:bg-blue-50"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <span
                    className={`text-[13px] font-semibold
                    ${field.value ? "text-blue-800" : "text-slate-700"}`}
                  >
                    {field.value ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full
                    transition-colors duration-150
                    ${field.value ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-sm
                      transition-transform duration-200
                      ${field.value ? "translate-x-[19px]" : "translate-x-[3px]"}`}
                    />
                  </span>
                </button>
              )}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="reset-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={() => reset()}
            className="reset-btn"
            disabled={isSubmitting}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.2} />
            Reset
          </button>
          <button
            onClick={handleSubmit(submit)}
            disabled={isSubmitting}
            className="submit-btn disabled:opacity-50"
          >
            <Save className="w-4 h-4" strokeWidth={2.2} />
            {isSubmitting ? "Creating…" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
