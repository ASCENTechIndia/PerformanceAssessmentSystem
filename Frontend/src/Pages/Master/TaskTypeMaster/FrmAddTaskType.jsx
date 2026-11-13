import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, LayoutList, Save, RotateCcw } from "lucide-react";
import Layout from "../../../Components/Layout";

const FrmAddTaskType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const taskType = location.state?.taskType; // present on edit, absent on add
  const isEdit = !!id && !!taskType;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      name: taskType?.name || "",
      active: taskType?.active ?? true,
      description: taskType?.description || "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      // await apiService[isEdit ? "put" : "post"](`/master/task-type${isEdit ? `/${id}` : ""}`, data);
      await new Promise((r) => setTimeout(r, 500));
      console.log(isEdit ? "Update →" : "Create →", data);
      toast.success(
        `${data.name} ${isEdit ? "updated" : "saved"} successfully`,
      );
    //   navigate("/master/task-type");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save task type");
    }
  };

  return (
    <Layout
      title={isEdit ? "Edit Task Type" : "Add Task Type"}
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: isEdit ? "Edit Task Type" : "Add Task Type",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Back link */}
        <Link
          to="/master/task-type"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500
            hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Task Type List
        </Link>

        {/* Form card */}
        <div className="bg-white rounded-xl ring-1 ring-slate-200 p-5">
          {/* Section header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
            <div
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500 text-white
              flex items-center justify-center flex-shrink-0
              shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]"
            >
              <LayoutList className="w-4 h-4" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">
                Task Type Details
              </p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">
                {isEdit
                  ? "Update the task type information"
                  : "Create a new task type"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Task Type Name */}
            <div>
              <label htmlFor="name" className="pas-label">
                Task Type Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Safety Inspection"
                className="pas-input"
                aria-invalid={!!errors.name}
                autoFocus
                {...register("name", {
                  required: "Task type name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: 60, message: "Max 60 characters" },
                })}
              />
              {errors.name && (
                <p className="pas-error">{errors.name.message}</p>
              )}
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

            {/* Description */}
            <div>
              <label htmlFor="description" className="pas-label">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="What kind of tasks does this type cover?"
                className="pas-input resize-none"
                aria-invalid={!!errors.description}
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 10, message: "At least 10 characters" },
                  maxLength: { value: 300, message: "Max 300 characters" },
                })}
              />
              {errors.description ? (
                <p className="pas-error">{errors.description.message}</p>
              ) : (
                <p className="pas-help">Between 10 and 300 characters</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3
          pt-4 border-t border-slate-100"
        >
          <p className="text-[11px] text-slate-500 order-2 sm:order-1">
            <span className="text-rose-500">*</span> All fields are required
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => navigate("/master/task-type")}
              disabled={isSubmitting}
              className="reset-btn"
            >
              Cancel
            </button>
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
              {isSubmitting
                ? "Saving…"
                : isEdit
                  ? "Update Task Type"
                  : "Save Task Type"}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default FrmAddTaskType;
