import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserCog, X, ShieldCheck } from "lucide-react";

const LEVEL_OPTIONS = [
  { value: "1", label: "1 — Top Management (HOD)" },
  { value: "2", label: "2 — Senior Management" },
  { value: "3", label: "3 — Middle Management" },
  { value: "4", label: "4 — Junior Staff" },
  { value: "5", label: "5 — Entry Level" },
];

const DesignationFormModal = ({ open, designation, onClose, onSubmit }) => {
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
        designation || {
          name: "",
          level: "3",
          adminAccess: false,
          description: "",
          active: true,
        },
      );
    }
  }, [open, designation, reset]);

  if (!open) return null;

  const isEdit = !!designation;
  const adminAccess = watch("adminAccess");

  const submit = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit({
      ...data,
      level: Number(data.level),
    });
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
              <UserCog className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-800">
                {isEdit ? "Edit designation" : "New designation"}
              </p>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                {isEdit
                  ? "Update the details below"
                  : "Designations define hierarchy and access"}
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
              Designation Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Senior Engineer"
              className="pas-input"
              aria-invalid={!!errors.name}
              autoFocus
              {...register("name", {
                required: "Designation name is required",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: { value: 60, message: "Max 60 characters" },
              })}
            />
            {errors.name && <p className="pas-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="level" className="pas-label">
              Hierarchy Level <span className="text-rose-500">*</span>
            </label>
            <select
              id="level"
              className="pas-input"
              aria-invalid={!!errors.level}
              {...register("level", { required: "Level is required" })}
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.level ? (
              <p className="pas-error">{errors.level.message}</p>
            ) : (
              <p className="pas-help">
                Used to build the org hierarchy and permission chain
              </p>
            )}
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
              placeholder="Responsibilities of this designation…"
              className="pas-input resize-none"
              {...register("description")}
            />
          </div>

          {/* Admin access toggle — highlighted */}
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors
              ${
                adminAccess
                  ? "bg-indigo-50 border-indigo-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
          >
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer flex-shrink-0"
              {...register("adminAccess")}
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck
                  className={`w-3.5 h-3.5 ${adminAccess ? "text-indigo-600" : "text-slate-400"}`}
                />
                <span className="text-[13px] font-semibold text-slate-800">
                  Admin Access
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Grants access to Setup pages only. <b>No task override</b>.
              </p>
            </div>
          </label>

          <label className="pas-check-row">
            <input type="checkbox" {...register("active")} />
            <span>
              <span className="block text-[13px] font-semibold text-slate-800">
                Active
              </span>
              <span className="block text-[11.5px] text-slate-500 mt-0.5">
                Inactive designations are hidden from employee assignment
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
                : "Create designation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignationFormModal;
