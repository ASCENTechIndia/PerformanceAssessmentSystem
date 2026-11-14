import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Building2,
  Save,
  RotateCcw,
  History,
  CalendarDays,
  UserRound,
} from "lucide-react";
import Layout from "../../../Components/Layout";

/* ---------- Options ---------- */
const ULB_OPTIONS = [
  { value: "nagpur", label: "Nagpur Municipal Corp" },
  { value: "pune", label: "Pune Municipal Corp" },
  { value: "mumbai", label: "Mumbai Municipal Corp" },
  { value: "nashik", label: "Nashik Municipal Corp" },
];

const DEPARTMENT_OPTIONS = [
  { value: "d1", label: "Information Technology" },
  { value: "d2", label: "Accounts" },
  { value: "d3", label: "Human Resources" },
  { value: "d4", label: "Sanitation" },
  { value: "d5", label: "Water Supply" },
];

const DESIGNATION_OPTIONS = [
  { value: "g1", label: "HOD" },
  { value: "g2", label: "Senior Engineer" },
  { value: "g3", label: "Junior Engineer" },
  { value: "g4", label: "System Admin" },
  { value: "g5", label: "Trainee" },
];

const REPORTING_OPTIONS = [
  { value: "e1", label: "Shri Kumar · E001" },
  { value: "e2", label: "Ravi Sharma · E002" },
  { value: "e5", label: "Sneha Iyer · E005" },
  { value: "e6", label: "Suresh Rao · E006" },
];

/* ---------- Reusable section header ---------- */
const SectionHeader = ({ icon: Icon, title, subtitle, color = "blue" }) => {
  const palette = {
    blue: "from-blue-500 to-sky-500",
    violet: "from-violet-500 to-purple-500",
  }[color];

  return (
    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
      <div
        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${palette} text-white
        flex items-center justify-center flex-shrink-0
        shadow-[0_3px_8px_-2px_rgba(15,23,42,0.25)]`}
      >
        <Icon className="w-4 h-4" strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-[13px] font-bold text-slate-800">{title}</p>
        {subtitle && (
          <p className="text-[10.5px] text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

/* ---------- Page ---------- */
const AddEmployee = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      empCode: "",
      name: "",
      joiningDate: "",
      email: "",
      mobile: "",
      active: true,
      ulb: "",
      departmentId: "",
      designationId: "",
      reportingOfficerId: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      // await apiService.post("/employees", data);
      await new Promise((r) => setTimeout(r, 500));
      console.log("New employee →", data);
      toast.success(`${data.name} added successfully`);
      navigate("/master/employees");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add employee");
    }
  };

  const handleCancel = () => navigate("/master/employees");

  return (
    <Layout
      title="Add Employee"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Add Employee",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Back link */}
        <Link
          to="/master/employees"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500
            hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Employee List
        </Link>

        {/* ───────────── Section 1: Basic Details ───────────── */}
        <div className="bg-white rounded-xl ring-1 ring-slate-200 p-5">
          <SectionHeader
            icon={User}
            title="Basic Details"
            subtitle="Personal information and contact details"
            color="blue"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Code */}
            <div>
              <label htmlFor="empCode" className="pas-label">
                Employee Code <span className="text-rose-500">*</span>
              </label>
              <input
                id="empCode"
                type="text"
                placeholder="e.g. E011"
                className="pas-input"
                aria-invalid={!!errors.empCode}
                autoFocus
                {...register("empCode", {
                  required: "Employee code is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: 20, message: "Max 20 characters" },
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/,
                    message: "Letters, numbers, and hyphens only",
                  },
                })}
              />
              {errors.empCode && (
                <p className="pas-error">{errors.empCode.message}</p>
              )}
            </div>

            {/* Employee Name */}
            <div>
              <label htmlFor="name" className="pas-label">
                Employee Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Rakesh Verma"
                className="pas-input"
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "Employee name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: 80, message: "Max 80 characters" },
                })}
              />
              {errors.name && (
                <p className="pas-error">{errors.name.message}</p>
              )}
            </div>

            {/* Joining Date */}
            <div>
              <label htmlFor="joiningDate" className="pas-label">
                Joining Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="joiningDate"
                type="date"
                className="pas-input"
                aria-invalid={!!errors.joiningDate}
                max={new Date().toISOString().split("T")[0]}
                {...register("joiningDate", {
                  required: "Joining date is required",
                  validate: (v) =>
                    new Date(v) <= new Date() ||
                    "Joining date cannot be in the future",
                })}
              />
              {errors.joiningDate && (
                <p className="pas-error">{errors.joiningDate.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="pas-label">
                Email ID <span className="text-rose-500">*</span>
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
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="pas-error">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="pas-label">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                placeholder="10-digit number"
                className="pas-input"
                aria-invalid={!!errors.mobile}
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                })}
              />
              {errors.mobile && (
                <p className="pas-error">{errors.mobile.message}</p>
              )}
            </div>

            {/* Status — toggle */}
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
                      ${field.value
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
          </div>
        </div>

        {/* ───────────── Section 2: Organization Mapping ───────────── */}
        <div className="bg-white rounded-xl ring-1 ring-slate-200 p-5">
          <SectionHeader
            icon={Building2}
            title="Organization Mapping"
            subtitle="Assign the employee to a department and reporting hierarchy"
            color="violet"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ULB */}
            <div>
              <label htmlFor="ulb" className="pas-label">
                ULB <span className="text-rose-500">*</span>
              </label>
              <select
                id="ulb"
                className="pas-input"
                aria-invalid={!!errors.ulb}
                {...register("ulb", { required: "ULB is required" })}
              >
                <option value="">Select ULB…</option>
                {ULB_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
              {errors.ulb && <p className="pas-error">{errors.ulb.message}</p>}
            </div>

            {/* Department */}
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
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="pas-error">{errors.departmentId.message}</p>
              )}
            </div>

            {/* Designation */}
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
                {DESIGNATION_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              {errors.designationId && (
                <p className="pas-error">{errors.designationId.message}</p>
              )}
            </div>

            {/* Reporting To */}
            <div>
              <label htmlFor="reportingOfficerId" className="pas-label">
                Reporting To <span className="text-rose-500">*</span>
              </label>
              <select
                id="reportingOfficerId"
                className="pas-input"
                aria-invalid={!!errors.reportingOfficerId}
                {...register("reportingOfficerId", {
                  required: "Reporting officer is required",
                })}
              >
                <option value="">Select reporting officer…</option>
                {REPORTING_OPTIONS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
              {errors.reportingOfficerId && (
                <p className="pas-error">{errors.reportingOfficerId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* ───────────── Section 3: Audit Information ───────────── */}
        <div className="bg-white rounded-xl ring-1 ring-slate-200 p-5">
          <SectionHeader
            icon={History}
            title="Audit Information"
            subtitle="Record of employee creation and modification"
            color="blue"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Created By */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <UserRound className="w-4 h-4 text-blue-500" />
                <p className="text-[11px] font-medium text-slate-500">
                  Created By
                </p>
              </div>
              <p className="text-[13px] font-semibold text-slate-800">
                Admin User
              </p>
            </div>

            {/* Created Date */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                <p className="text-[11px] font-medium text-slate-500">
                  Created Date
                </p>
              </div>
              <p className="text-[13px] font-semibold text-slate-800">
                14 Nov 2026
              </p>
            </div>

            {/* Updated By */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <UserRound className="w-4 h-4 text-violet-500" />
                <p className="text-[11px] font-medium text-slate-500">
                  Updated By
                </p>
              </div>
              <p className="text-[13px] font-semibold text-slate-800">
                Admin User
              </p>
            </div>

            {/* Updated Date */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-violet-500" />
                <p className="text-[11px] font-medium text-slate-500">
                  Updated Date
                </p>
              </div>
              <p className="text-[13px] font-semibold text-slate-800">
                14 Nov 2026
              </p>
            </div>
          </div>
        </div>

        {/* ───────────── Footer ───────────── */}
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
              onClick={handleCancel}
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
              {isSubmitting ? "Saving…" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default AddEmployee;
