import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Users, X } from "lucide-react";

const EmployeeFormModal = ({
  open,
  employee,
  employees,
  designations,
  departments,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (open) {
      reset(
        employee || {
          empCode: "",
          name: "",
          email: "",
          mobile: "",
          designationId: "",
          departmentId: "",
          reportingOfficerId: "",
          active: true,
        },
      );
    }
  }, [open, employee, reset]);

  const watchedDesignationId = watch("designationId");

  // ✅ MOVED UP — must run on every render, not just when modal is open
  const reportingOfficerOptions = useMemo(
    () =>
      employees.filter((e) => e.active && (!employee || e.id !== employee.id)),
    [employees, employee],
  );

  const previewDesignation = designations.find(
    (d) => d.id === watchedDesignationId,
  );
  const previewRole = previewDesignation?.adminAccess
    ? "Admin"
    : previewDesignation && previewDesignation.level <= 2
      ? "Senior"
      : "Junior";

  // ✅ Early return AFTER all hooks
  if (!open) return null;

  const isEdit = !!employee;

  const submit = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(data);
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
        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                {isEdit ? "Edit employee" : "New employee"}
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                {isEdit ? "Update the details below" : "Add a new team member"}
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
          {/* Row 1: code + name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="empCode" className="pas-label">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <input
                id="empCode"
                type="text"
                placeholder="e.g. E007"
                className="pas-input"
                aria-invalid={!!errors.empCode}
                autoFocus
                {...register("empCode", {
                  required: "Employee ID is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: 20, message: "Max 20 characters" },
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/,
                    message: "Letters, numbers, and hyphens only",
                  },
                  validate: (v) =>
                    !employees.some(
                      (e) => e.empCode === v && e.id !== employee?.id,
                    ) || "This Employee ID already exists",
                })}
              />
              {errors.empCode && (
                <p className="pas-error">{errors.empCode.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="pas-label">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Ravi Sharma"
                className="pas-input"
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: 80, message: "Max 80 characters" },
                })}
              />
              {errors.name && (
                <p className="pas-error">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: email + mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="pas-label">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="pas-input"
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="pas-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="mobile" className="pas-label">
                Mobile{" "}
                <span className="text-slate-400 normal-case font-normal">
                  (optional)
                </span>
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder="10-digit number"
                className="pas-input"
                aria-invalid={!!errors.mobile}
                {...register("mobile", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a 10-digit mobile number",
                  },
                })}
              />
              {errors.mobile && (
                <p className="pas-error">{errors.mobile.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: designation + department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="designationId" className="pas-label">
                Designation <span className="text-rose-500">*</span>
              </label>
              <select
                id="designationId"
                className="pas-input"
                aria-invalid={!!errors.designationId}
                {...register("designationId", {
                  required: "Designation is required",
                })}
              >
                <option value="">Select designation…</option>
                {designations
                  .filter((d) => d.active || d.id === employee?.designationId)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} · Level {d.level}
                      {d.adminAccess ? " · Admin" : ""}
                    </option>
                  ))}
              </select>
              {errors.designationId ? (
                <p className="pas-error">{errors.designationId.message}</p>
              ) : previewDesignation ? (
                <p className="pas-help">
                  Role:{" "}
                  <span className="font-semibold text-emerald-700">
                    {previewRole}
                  </span>{" "}
                  (derived from designation)
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="departmentId" className="pas-label">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                id="departmentId"
                className="pas-input"
                aria-invalid={!!errors.departmentId}
                {...register("departmentId", {
                  required: "Department is required",
                })}
              >
                <option value="">Select department…</option>
                {departments
                  .filter((d) => d.active || d.id === employee?.departmentId)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                      {d.code ? ` (${d.code})` : ""}
                    </option>
                  ))}
              </select>
              {errors.departmentId && (
                <p className="pas-error">{errors.departmentId.message}</p>
              )}
            </div>
          </div>

          {/* Reporting officer */}
          <div>
            <label htmlFor="reportingOfficerId" className="pas-label">
              Reporting Officer{" "}
              <span className="text-slate-400 normal-case font-normal">
                (optional)
              </span>
            </label>
            <select
              id="reportingOfficerId"
              className="pas-input"
              {...register("reportingOfficerId")}
            >
              <option value="">— Top of hierarchy —</option>
              {reportingOfficerOptions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} · {e.empCode}
                </option>
              ))}
            </select>
            <p className="pas-help">
              Leave empty for department heads. This drives Senior/Junior role
              computation.
            </p>
          </div>

          {/* Active */}
          <label className="pas-check-row">
            <input type="checkbox" {...register("active")} />
            <span>
              <span className="block text-[13px] font-semibold text-slate-800">
                Active
              </span>
              <span className="block text-[11.5px] text-slate-500 mt-0.5">
                Inactive employees cannot log in or receive tasks
              </span>
            </span>
          </label>
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
            onClick={handleSubmit(submit)}
            disabled={isSubmitting}
            className="submit-btn disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : isEdit
                ? "Save changes"
                : "Create employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
