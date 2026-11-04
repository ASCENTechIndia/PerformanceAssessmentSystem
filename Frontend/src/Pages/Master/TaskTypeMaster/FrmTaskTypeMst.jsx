import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Layout from "../../../Components/Layout";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import Label from "../../../Components/Label";

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const FrmTaskTypeMst = () => {
  const { setLoading } = useLoader();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      typeName: "",
      defaultTimeline: "",
      priority: "Medium",
      supportingDocsMandatory: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // await apiService.post("/master/task-type", data);
      console.log("Payload →", data);
      toast.success("Task Type saved successfully");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save Task Type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Task Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Task Type Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Type Name */}
        <div>
          <Label text={"Type Name"} required={true} />
          <input
            id="typeName"
            type="text"
            placeholder="e.g. Safety Inspection"
            className="pas-input"
            aria-invalid={!!errors.typeName}
            {...register("typeName", {
              required: "Type name is required",
              minLength: { value: 2, message: "At least 2 characters" },
              maxLength: { value: 60, message: "Max 60 characters" },
            })}
          />
          {errors.typeName && (
            <p className="pas-error">{errors.typeName.message}</p>
          )}
        </div>

        {/* Two-column row: timeline + priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label text={"Default Timeline (days)"} required={true} />
            <input
              id="defaultTimeline"
              type="number"
              min={1}
              placeholder="e.g. 7"
              className="pas-input"
              aria-invalid={!!errors.defaultTimeline}
              {...register("defaultTimeline", {
                required: "Default timeline is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1 day" },
                max: { value: 365, message: "Cannot exceed 365 days" },
              })}
            />
            {errors.defaultTimeline ? (
              <p className="pas-error">{errors.defaultTimeline.message}</p>
            ) : (
              <p className="pas-help">
                Number of days expected to complete this task.
              </p>
            )}
          </div>

          <div>
            <Label text={"Priority"} required={true} />
            <select
              id="priority"
              className="pas-input"
              aria-invalid={!!errors.priority}
              {...register("priority", { required: "Priority is required" })}
            >
              <option value="">Select priority…</option>
              {PRIORITY_OPTIONS.map((p) => (
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

        {/* Supporting documents toggle */}
        <div>
          <label className="pas-check-row">
            <input type="checkbox" {...register("supportingDocsMandatory")} />
            <span>
              <span className="block text-[13px] font-semibold text-slate-800">
                Supporting documents mandatory
              </span>
              <span className="block text-[11.5px] text-slate-500 mt-0.5">
                Users must upload at least one document to submit this task.
              </span>
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className="reset-btn"
          >
            Reset
          </button>
          <button type="submit" className="submit-btn">
            Save Task Type
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmTaskTypeMst;
