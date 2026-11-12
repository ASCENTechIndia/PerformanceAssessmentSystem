import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Building2, X } from "lucide-react";

const DepartmentFormModal = ({
  open,
  department,
  employees,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (open) {
      reset(
        department || {
          name: "",
          code: "",
          headId: "",
          description: "",
          active: true,
        },
      );
    }
  }, [open, department, reset]);

  if (!open) return null;

  const isEdit = !!department;

  const submit = async (data) => {
    // Simulate network — replace with apiService.post(...)
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
        className="relative w-full max-w-lg bg-white rounded-2xl ring-1 ring-slate-200
        shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                {isEdit ? "Edit department" : "New department"}
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                {isEdit
                  ? "Update the details below"
                  : "Create a department to organise employees"}
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
          className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto"
        >
          <div>
            <label htmlFor="name" className="pas-label">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Information Technology"
              className="pas-input"
              aria-invalid={!!errors.name}
              autoFocus
              {...register("name", {
                required: "Department name is required",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: { value: 80, message: "Max 80 characters" },
              })}
            />
            {errors.name && <p className="pas-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="code" className="pas-label">
              Short Code{" "}
              <span className="text-slate-400 normal-case font-normal">
                (optional)
              </span>
            </label>
            <input
              id="code"
              type="text"
              placeholder="e.g. IT"
              className="pas-input"
              {...register("code", {
                maxLength: { value: 10, message: "Max 10 characters" },
              })}
            />
            {errors.code ? (
              <p className="pas-error">{errors.code.message}</p>
            ) : (
              <p className="pas-help">Short form used in reports</p>
            )}
          </div>

          <div>
            <label htmlFor="headId" className="pas-label">
              Department Head{" "}
              <span className="text-slate-400 normal-case font-normal">
                (optional)
              </span>
            </label>
            <select id="headId" className="pas-input" {...register("headId")}>
              <option value="">— Not assigned —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                  {emp.designation ? ` · ${emp.designation}` : ""}
                </option>
              ))}
            </select>
            <p className="pas-help">
              Can be set later after employees are created
            </p>
          </div>

          <div>
            <label htmlFor="description" className="pas-label">
              Description{" "}
              <span className="text-slate-400 normal-case font-normal">
                (optional)
              </span>
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="What does this department handle?"
              className="pas-input resize-none"
              {...register("description")}
            />
          </div>

          <label className="pas-check-row">
            <input type="checkbox" {...register("active")} />
            <span>
              <span className="block text-[13px] font-semibold text-slate-800">
                Active
              </span>
              <span className="block text-[11.5px] text-slate-500 mt-0.5">
                Inactive departments are hidden from assignment dropdowns
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
                : "Create department"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentFormModal;
