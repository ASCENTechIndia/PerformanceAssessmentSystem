import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { CheckCircle2, X, Check, CalendarDays, Flag, User } from "lucide-react";

/* ---------- Dummy options (replace with API data) ---------- */
const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "accounts", label: "Accounts" },
  { value: "hr", label: "Human Resources" },
  { value: "sanitation", label: "Sanitation" },
];

const EMPLOYEES = [
  { id: "e1", name: "Sneha Patil", department: "engineering" },
  { id: "e2", name: "Ravi Sharma", department: "engineering" },
  { id: "e3", name: "Priya Menon", department: "accounts" },
  { id: "e4", name: "Amit Patel", department: "accounts" },
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const AssignTaskModal = ({
  open,
  onClose,
  task,
  onAssign,
  createdBy = "Rajesh Kulkarni",
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      department: "",
      assignedTo: "",
      expectedStart: "",
      expectedCompletion: "",
      priority: task?.priority || "Medium",
      active: true,
      meetingReference: "",
    },
    mode: "onBlur",
  });

  const selectedDepartment = watch("department");
  const selectedEmployeeId = watch("assignedTo");
  const expectedStart = watch("expectedStart");

  /* Filter employees based on selected department */
  const filteredEmployees = useMemo(
    () =>
      EMPLOYEES.filter(
        (emp) => !selectedDepartment || emp.department === selectedDepartment,
      ),
    [selectedDepartment],
  );

  const selectedEmployee = filteredEmployees.find(
    (e) => e.id === selectedEmployeeId,
  );

  /* Reset form on open */
  useEffect(() => {
    if (open && task) {
      reset({
        department: "",
        assignedTo: "",
        expectedStart: "",
        expectedCompletion: "",
        priority: task.priority || "Medium",
        active: true,
        meetingReference: "",
      });
    }
  }, [open, task, reset]);

  /* Auto-calculate Expected Completion when Expected Start changes */
  useEffect(() => {
    if (expectedStart && task?.expectedDuration) {
      const start = new Date(expectedStart);
      const end = new Date(start);
      end.setDate(end.getDate() + Number(task.expectedDuration));
      setValue("expectedCompletion", end.toISOString().split("T")[0]);
    }
  }, [expectedStart, task?.expectedDuration, setValue]);

  if (!open || !task) return null;

  const today = new Date().toISOString().split("T")[0];

  const submit = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    const emp = EMPLOYEES.find((e) => e.id === data.assignedTo);
    onAssign({
      ...data,
      assignedToName: emp?.name || data.assignedTo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl ring-1 ring-slate-200 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Brand accent strip */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-slate-800">
                  Assign Task
                </p>
                <span className="text-[11px] font-medium text-slate-400">
                  Step 2 of 2 · Assign to team
                </span>
              </div>
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

        {/* Scrollable Body */}
        <div className="px-6 py-4 overflow-y-auto space-y-5">
          {/* Success Banner */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 ring-1 ring-emerald-200 text-[12.5px] text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Task <b>{task.id}</b> created. Now assign it to a team member.
            </span>
          </div>

          <form
            id="assign-task-form"
            onSubmit={handleSubmit(submit)}
            className="space-y-6"
          >
            {/* ────────── Task Section ────────── */}
            <div>
              <label className="pas-label">
                Task <span className="text-rose-500">*</span>
              </label>
              <select
                className="pas-input bg-slate-50 text-slate-500 cursor-not-allowed"
                disabled
              >
                <option>
                  {task.id} — {task.title}
                </option>
              </select>

              {/* Task Detail Card */}
              <div className="mt-3 p-4 rounded-xl bg-slate-50 ring-1 ring-slate-200">
                <p className="text-[13px] font-semibold text-slate-800">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px]">
                  <span className="font-medium text-slate-600">
                    {task.taskType}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    Expected {task.expectedDuration} days
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    Parent: {task.parent || "No"}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={`font-semibold ${task.assignedTo ? "text-blue-600" : "text-amber-600"}`}
                  >
                    Status: {task.assignedTo ? "Assigned" : "Not assigned"}
                  </span>
                </div>
                {task.completionCriteria && (
                  <p className="text-[11.5px] text-slate-600 mt-2 leading-relaxed">
                    <strong className="text-slate-800">
                      Completion criteria:
                    </strong>{" "}
                    {task.completionCriteria}
                  </p>
                )}
              </div>
            </div>

            {/* ────────── Assignment Details ────────── */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Assignment Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Department */}
                <div>
                  <label className="pas-label">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="pas-input"
                    {...register("department", { required: "Required" })}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="pas-error">{errors.department.message}</p>
                  )}
                </div>

                {/* 2. Assigned To */}
                <div>
                  <label className="pas-label">
                    Assigned To <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="pas-input"
                    {...register("assignedTo", { required: "Required" })}
                  >
                    <option value="">Select employee</option>
                    {filteredEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo ? (
                    <p className="pas-error">{errors.assignedTo.message}</p>
                  ) : (
                    <p className="pas-help">
                      Your juniors in the selected department
                    </p>
                  )}
                </div>

                {/* 3. Assigned By */}
                <div>
                  <label className="pas-label">Assigned By</label>
                  <input
                    type="text"
                    className="pas-input bg-slate-50 text-slate-500"
                    value={createdBy}
                    readOnly
                  />
                </div>

                {/* 4. Assigned Date */}
                <div>
                  <label className="pas-label">Assigned Date</label>
                  <input
                    type="text"
                    className="pas-input bg-slate-50 text-slate-500"
                    value={today}
                    readOnly
                  />
                </div>

                {/* 5. Expected Start */}
                <div>
                  <label className="pas-label">
                    Expected Start <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="pas-input"
                    {...register("expectedStart", { required: "Required" })}
                  />
                  {errors.expectedStart && (
                    <p className="pas-error">{errors.expectedStart.message}</p>
                  )}
                </div>

                {/* 6. Expected Completion */}
                <div>
                  <label className="pas-label">
                    Expected Completion <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="pas-input"
                    {...register("expectedCompletion", {
                      required: "Required",
                    })}
                  />
                  {errors.expectedCompletion ? (
                    <p className="pas-error">
                      {errors.expectedCompletion.message}
                    </p>
                  ) : (
                    <p className="pas-help">
                      Auto-filled from {task.expectedDuration}-day duration ·
                      editable
                    </p>
                  )}
                </div>

                {/* 7. Status */}
                <div>
                  <label className="pas-label">Status</label>
                  <input
                    type="text"
                    className="pas-input bg-slate-50 text-slate-500"
                    value="Assigned"
                    readOnly
                  />
                </div>

                {/* 8. Active Toggle */}
                <div>
                  <label className="pas-label">Active</label>
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-150
                          ${field.value ? "bg-blue-50/60 border-blue-200 hover:bg-blue-50" : "bg-white border-slate-200 hover:border-slate-300"}`}
                      >
                        <span
                          className={`text-[13px] font-semibold ${field.value ? "text-blue-800" : "text-slate-700"}`}
                        >
                          {field.value ? "Yes" : "No"}
                        </span>
                        <span
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150
                          ${field.value ? "bg-blue-500" : "bg-slate-300"}`}
                        >
                          <span
                            className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200
                            ${field.value ? "translate-x-[19px]" : "translate-x-[3px]"}`}
                          />
                        </span>
                      </button>
                    )}
                  />
                </div>

                {/* 9. Priority */}
                <div>
                  <label className="pas-label">
                    Priority <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="pas-input"
                    {...register("priority", { required: "Required" })}
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
            </div>

            {/* ────────── Meeting Reference ────────── */}
            <div>
              <label className="pas-label">
                Meeting Reference{" "}
                <span className="text-slate-400 normal-case font-normal">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ward review meeting, 10 Nov 2026 — MoM item 4"
                className="pas-input"
                {...register("meetingReference")}
              />
              <p className="pas-help">
                Meeting or minutes where this assignment was decided
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          <p className="text-[11.5px] text-slate-500 max-w-[60%] leading-snug">
            {selectedEmployee ? (
              <>
                <b>{selectedEmployee.name}</b> will be notified and the task
                will appear in their <b>My Tasks</b>.
              </>
            ) : (
              "The assignee will be notified and the task will appear in their My Tasks."
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="reset-btn"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
            <button
              type="submit"
              form="assign-task-form"
              className="submit-btn disabled:opacity-50"
            >
              <Check className="w-4 h-4" strokeWidth={2.4} />
              {isSubmitting ? "Assigning…" : "Assign Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
