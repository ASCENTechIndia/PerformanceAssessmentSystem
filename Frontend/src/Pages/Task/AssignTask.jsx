import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ClipboardList,
  User,
  UserCheck,
  Info,
  RotateCcw,
  Save,
} from "lucide-react";
import Layout from "../../Components/Layout";

/* ---------- Dummy data (will come from API tomorrow) ---------- */
const TASK_TYPES = [
  {
    value: "inspection",
    label: "Inspection",
    defaultPriority: "High",
    defaultDays: 7,
  },
  {
    value: "audit",
    label: "Audit",
    defaultPriority: "Medium",
    defaultDays: 10,
  },
  {
    value: "review",
    label: "Review",
    defaultPriority: "Medium",
    defaultDays: 5,
  },
  { value: "report", label: "Report", defaultPriority: "Low", defaultDays: 3 },
];

const EMPLOYEES = [
  { value: "e101", label: "Ravi Sharma", dept: "IT", open: 3 },
  { value: "e102", label: "Priya Menon", dept: "IT", open: 5 },
  { value: "e103", label: "Amit Patel", dept: "IT", open: 1 },
  { value: "e104", label: "Sneha Iyer", dept: "IT", open: 7 },
];

const PRIORITIES = ["High", "Medium", "Low"];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

const AssignTask = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      taskType: "",
      priority: "Medium",
      assignTo: "",
      deadline: "",
      attachments: [],
      instructions: "",
    },
    mode: "onBlur",
  });

  const watched = watch();
  const selectedEmployee = EMPLOYEES.find((e) => e.value === watched.assignTo);
  const selectedType = TASK_TYPES.find((t) => t.value === watched.taskType);

  const attachments = watch("attachments") || [];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const existingFiles = Array.from(attachments);

    const newFiles = [...existingFiles, ...selectedFiles];

    // Remove duplicate files
    const uniqueFiles = newFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified,
        ),
    );

    setValue("attachments", uniqueFiles, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // Allow selecting the same file again
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = attachments.filter((_, i) => i !== index);

    setValue("attachments", updatedFiles, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleClearFiles = () => {
    setValue("attachments", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const daysUntil = watched.deadline
    ? Math.ceil((new Date(watched.deadline) - new Date()) / 86_400_000)
    : null;

  /* Auto-fill priority + deadline when type changes */
  const handleTypeChange = (e) => {
    const type = TASK_TYPES.find((t) => t.value === e.target.value);
    if (!type) return;
    setValue("priority", type.defaultPriority);
    const d = new Date();
    d.setDate(d.getDate() + type.defaultDays);
    setValue("deadline", d.toISOString().split("T")[0]);
  };

  const taskTypeReg = register("taskType", {
    required: "Task type is required",
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("taskType", data.taskType);
      formData.append("priority", data.priority);
      formData.append("assignTo", data.assignTo);
      formData.append("deadline", data.deadline);
      formData.append("instructions", data.instructions);

      Array.from(data.attachments || []).forEach((file) => {
        formData.append("attachments", file);
      });

      // Replace with your API call
      // await apiService.post("/tasks", formData);

      toast.success(
        `Task assigned to ${selectedEmployee?.label || "employee"}`,
      );

      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign task");
    }
  };
  return (
    <Layout
      title="Assign Task"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Assign Task",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Intro */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 via-white to-sky-50 ring-1 ring-blue-100">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-slate-800">
              Create and assign a new task
            </p>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              The employee will see this in their <b>My Tasks</b>. Once
              submitted, it lands in your <b>Review Queue</b>.
            </p>
          </div>
          <span className="hidden md:inline-flex text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2 py-1 rounded">
            Step 1 of 3
          </span>
        </div>

        {/* Two-column: form (2/3) + preview (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ---------- LEFT — form ---------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Information */}
            <fieldset className="space-y-4">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                Task Information
              </legend>

              <div>
                <label htmlFor="title" className="pas-label">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Quarterly safety inspection — Zone A"
                  className="pas-input"
                  aria-invalid={!!errors.title}
                  {...register("title", {
                    required: "Task title is required",
                    minLength: { value: 5, message: "At least 5 characters" },
                    maxLength: { value: 120, message: "Max 120 characters" },
                  })}
                />
                {errors.title && (
                  <p className="pas-error">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="pas-label">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe scope, what needs to be done, and expected outcome…"
                  className="pas-input resize-none"
                  aria-invalid={!!errors.description}
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 20, message: "At least 20 characters" },
                  })}
                />
                {errors.description ? (
                  <p className="pas-error">{errors.description.message}</p>
                ) : (
                  <p className="pas-help">
                    {watched.description.length} / 1000 characters
                  </p>
                )}
              </div>
            </fieldset>

            {/* Classification */}
            <fieldset className="space-y-4 pt-2">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                Classification
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="taskType" className="pas-label">
                    Task Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="taskType"
                    className="pas-input"
                    aria-invalid={!!errors.taskType}
                    {...taskTypeReg}
                    onChange={(e) => {
                      taskTypeReg.onChange(e);
                      handleTypeChange(e);
                    }}
                  >
                    <option value="">Select type…</option>
                    {TASK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  {errors.taskType ? (
                    <p className="pas-error">{errors.taskType.message}</p>
                  ) : (
                    selectedType && (
                      <p className="pas-help">
                        Suggested: {selectedType.defaultDays} days ·{" "}
                        {selectedType.defaultPriority} priority
                      </p>
                    )
                  )}
                </div>

                <div>
                  <label htmlFor="priority" className="pas-label">
                    Priority <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="priority"
                    className="pas-input"
                    aria-invalid={!!errors.priority}
                    {...register("priority", {
                      required: "Priority is required",
                    })}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.priority && (
                    <p className="pas-error">{errors.priority.message}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Assignment */}
            <fieldset className="space-y-4 pt-2">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                Assignment
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="assignTo" className="pas-label">
                    Assign To <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="assignTo"
                    className="pas-input"
                    aria-invalid={!!errors.assignTo}
                    {...register("assignTo", {
                      required: "Please select an employee",
                    })}
                  >
                    <option value="">Select employee…</option>
                    {EMPLOYEES.map((emp) => (
                      <option key={emp.value} value={emp.value}>
                        {emp.label} · {emp.dept} ({emp.open} open)
                      </option>
                    ))}
                  </select>
                  {errors.assignTo ? (
                    <p className="pas-error">{errors.assignTo.message}</p>
                  ) : (
                    <p className="pas-help">
                      Only employees in your department
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="deadline" className="pas-label">
                    Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    className="pas-input"
                    aria-invalid={!!errors.deadline}
                    {...register("deadline", {
                      required: "Deadline is required",
                      validate: (v) =>
                        new Date(v) > new Date() ||
                        "Deadline must be in the future",
                    })}
                  />
                  {errors.deadline && (
                    <p className="pas-error">{errors.deadline.message}</p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Attachments */}
            <fieldset className="space-y-4 pt-2">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                Attachments{" "}
                <span className="text-slate-300 normal-case tracking-normal font-normal">
                  (optional)
                </span>
              </legend>

              <div>
                <label htmlFor="attachments" className="pas-label">
                  Upload Documents
                </label>

                <input
                  id="attachments"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                  className="pas-input file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-blue-700 file:cursor-pointer"
                  onChange={handleFileChange}
                />

                <p className="pas-help">
                  Supported formats: PDF, JPG, JPEG. You can select multiple
                  files.
                </p>
              </div>

              {/* Selected Files */}
              {attachments.length > 0 && (
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-700">
                      Selected Files ({attachments.length})
                    </p>

                    <button
                      type="button"
                      onClick={handleClearFiles}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="flex items-center justify-between gap-3 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <ClipboardList className="w-4 h-4 text-blue-600" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[11.5px] font-medium text-slate-700 truncate">
                              {file.name}
                            </p>

                            <p className="text-[10px] text-slate-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="flex-shrink-0 text-[11px] font-medium text-rose-500 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50"
                          title="Remove file"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>

            {/* Notes */}
            <fieldset className="space-y-4 pt-2">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                Additional Notes{" "}
                <span className="text-slate-300 normal-case tracking-normal font-normal">
                  (optional)
                </span>
              </legend>
              <div>
                <label htmlFor="instructions" className="pas-label">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  rows={3}
                  placeholder="Any specific steps, contacts, or references…"
                  className="pas-input resize-none"
                  {...register("instructions")}
                />
              </div>
            </fieldset>
          </div>

          {/* ---------- RIGHT — preview ---------- */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Assignment Preview
                  </p>
                </div>

                {selectedEmployee ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
                        {getInitials(selectedEmployee.label)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-slate-800 truncate">
                          {selectedEmployee.label}
                        </p>
                        <p className="text-[10.5px] text-slate-500">
                          {selectedEmployee.dept} Department
                        </p>
                      </div>
                    </div>

                    <dl className="space-y-2 text-[11.5px]">
                      <div className="flex items-center justify-between">
                        <dt className="text-slate-500">Open tasks</dt>
                        <dd
                          className={`font-semibold ${selectedEmployee.open > 5 ? "text-amber-600" : "text-slate-700"}`}
                        >
                          {selectedEmployee.open}
                          {selectedEmployee.open > 5 && (
                            <span className="ml-1 text-[10px] text-amber-500">
                              high
                            </span>
                          )}
                        </dd>
                      </div>

                      {daysUntil !== null && (
                        <div className="flex items-center justify-between">
                          <dt className="text-slate-500">Deadline in</dt>
                          <dd
                            className={`font-semibold ${
                              daysUntil < 0
                                ? "text-rose-600"
                                : daysUntil < 3
                                  ? "text-amber-600"
                                  : "text-blue-600"
                            }`}
                          >
                            {daysUntil < 0
                              ? "Past due"
                              : daysUntil === 0
                                ? "Due today"
                                : `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`}
                          </dd>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <dt className="text-slate-500">Priority</dt>
                        <dd
                          className={`font-semibold ${
                            watched.priority === "High"
                              ? "text-rose-600"
                              : watched.priority === "Medium"
                                ? "text-amber-600"
                                : "text-slate-600"
                          }`}
                        >
                          {watched.priority}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[11.5px] text-slate-500">
                      Select an employee to see their workload and deadline
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Employee sees this in{" "}
                    <b className="text-slate-700">My Tasks</b>. After
                    submission, it moves to your{" "}
                    <b className="text-slate-700">Review Queue</b>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            <span className="text-rose-500">*</span> Required fields
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => reset()}
              disabled={!isDirty || isSubmitting}
              className="reset-btn"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.2} />
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn disabled:opacity-60"
            >
              <Save className="w-4 h-4" strokeWidth={2.2} />
              {isSubmitting ? "Assigning…" : "Assign Task"}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default AssignTask;
