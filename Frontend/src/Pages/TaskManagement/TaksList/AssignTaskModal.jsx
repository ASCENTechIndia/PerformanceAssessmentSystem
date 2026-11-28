import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CheckCircle2,
  X,
  Check,
  UploadCloud,
  FileText,
  Trash2,
} from "lucide-react";
import apiClient from "../../../../apiClient";
import { toast } from "sonner";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import { useConfirmation } from "../../../Context/ConfirmationContext";


const EMPLOYEES = [
  { id: "e1", name: "Sneha Patil", department: "engineering" },
  { id: "e2", name: "Ravi Sharma", department: "engineering" },
  { id: "e3", name: "Priya Menon", department: "accounts" },
  { id: "e4", name: "Amit Patel", department: "accounts" },
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

function formatDateToAPI(dateString) {
  if (!dateString) return;

  const [year, month, day] = dateString.split("-");

  const monthMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  return `${day}-${monthMap[month]}-${year}`;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
  });
};

const AssignTaskModal = ({ open, onClose, task, onAssign, createdBy = "" }) => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const userId = user?.userId;
  const ulbId = user?.ulbId;
  const deptId = user?.deptId;
  const { confirmAction } = useConfirmation();

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
      assignedBy: "",
      expectedStart: "",
      expectedCompletion: "",
      status: "103",
      priority: task?.priority || "Medium",
      active: true,
      actionRemark: "",
      document: [],
      meetingReference: "",
    },
    mode: "onBlur",
  });

  const selectedDepartment = watch("department");
  const selectedEmployeeId = watch("assignedTo");
  const expectedStart = watch("expectedStart");

  const [assignedByOptions, setAssignedByOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);

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
        actionRemark: "",
        document: [],
        meetingReference: "",
      });
    }
  }, [open, task, reset]);

  /* Auto-calculate Expected Completion when Expected Start changes */
  // useEffect(() => {
  //   if (expectedStart && task?.expectedDuration) {
  //     const start = new Date(expectedStart);
  //     const end = new Date(start);
  //     end.setDate(end.getDate() + Number(task.expectedDuration));
  //     setValue("expectedCompletion", end.toISOString().split("T")[0]);
  //   }
  // }, [expectedStart, task?.expectedDuration, setValue]);

  const today = new Date().toISOString().split("T")[0];

  const fetchAssignedToDropdown = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        `/getEmpDropdown?reportingId=${userId}&ulbId=${ulbId}&deptId=287`,
      );

      if (
        response.success &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const formatted = response.data.map((item) => ({
          label: item.EMPLOYEE_NAME,
          value: item.EMPLOYEE_ID,
        }));

        setAssignedToOptions(formatted);
      } else {
        setAssignedToOptions([]);
      }
    } catch (err) {
      setAssignedToOptions([]);
      console.error(err);
      toast.error(
        err.message || "Failed to fetch Assigned To employee dropdown",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusDropdown = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/getStatusDropdown");

      if (
        response.success &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const formatted = response.data.map((item) => ({
          ...item,
          label: item.STATUSNAME,
          value: item.STATUSID,
        }));

        setStatusOptions(formatted);
      }
    } catch (err) {
      setStatusOptions([]);
      console.error(err);
      toast.error(err.message || "Failed to fetch Status dropdown options");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (data) => {
    try {
      const confirmed = await confirmAction(
        "Are you sure you want to assign this task? This action cannot be undone.",
        "Assign Task"
      );

      if (!confirmed) return;

      setLoading(true);

      const payload = {
        IN_MODE: 1,
        IN_TASKASSIGNMENT_ID: null,
        IN_TASKID: Number(task.id),
        IN_DEPTID: Number(deptId),
        IN_ASSIGNEDBY: Number(userId),
        IN_ASSIGNEDTO: Number(data.assignedTo),
        IN_ASSIGNEDDATE: formatDateToAPI(today),
        IN_STARTDATE: formatDateToAPI(data.expectedStart),
        IN_DUEDATE: formatDateToAPI(data.expectedCompletion),
        IN_STATUSID: Number(data.status),
        IN_PRIORITY: data.priority,
        IN_FINISHEDDATE: null,
        IN_COMPLETEDDATE: null,
        IN_ISACTIVE: data.active ? "Y" : "N",
        IN_ACTIONREMARK: data.actionRemark,
        IN_meetingreference: data.meetingReference,
        IN_USERID: userId,
        // IN_DOCUMENTS: data.document.map((file) => ({
        //   DOCUMENTNAME: file.fileName,
        //   DOCUMENTTYPE: file.fileType,
        //   DOCUMENTBASE64: file.base64,
        // })),
      };

      const response = await apiClient.post(
        "/AOPT_TASKASSIGNMENT_INSUPD",
        payload,
      );
      if (response.success && response.errorCode === 9999) {
        toast.success(response.errorMessage);
        reset();
        onClose();
      } else {
        toast.error(response.errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to assign task");
    } finally {
      setLoading(false);
    }

    // await new Promise((r) => setTimeout(r, 400));
    // const emp = EMPLOYEES.find((e) => e.id === data.assignedTo);
    // onAssign({
    //   ...data,
    //   assignedToName: emp?.name || data.assignedTo,
    // });
  };

  useEffect(() => {
    if (user) {
      fetchAssignedToDropdown();
      fetchStatusDropdown();
    }
  }, [user]);

  if (!open || !task) return null;

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
                <p
                  className="font-semibold text-slate-800"
                  style={{
                    fontSize: "20px",
                  }}
                >
                  Assign Task
                </p>
                <span
                  className="font-medium text-slate-400"
                  style={{
                    fontSize: "16px",
                    alignSelf: "center",
                    marginTop: 2,
                  }}
                >
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
                {/* <div>
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
                </div> */}

                {/* 3. Assigned By */}
                {/* <div>
                  <label className="pas-label">Assigned By</label>
                  
                  <select
                    className="pas-input"
                    {...register("assignedBy", { required: "Required" })}
                  >
                    <option value="">Select employee</option>
                    {filteredEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedBy ? (
                    <p className="pas-error">{errors.assignedBy.message}</p>
                  ) : (
                    <p className="pas-help">
                      Your juniors in the selected department
                    </p>
                  )}
                </div> */}

                {/* 2. Assigned To */}
                <div>
                  <label className="pas-label">
                    Assign To <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="pas-input"
                    {...register("assignedTo", { required: "Required" })}
                  >
                    <option value="">Select employee</option>
                    {assignedToOptions.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
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

                {/* 4. Assigned Date */}
                {/* <div>
                  <label className="pas-label">Assigned Date</label>
                  <input
                    type="text"
                    className="pas-input bg-slate-50 text-slate-500"
                    value={today}
                    readOnly
                  />
                </div> */}

                {/* 5. Expected Start */}
                <div>
                  <label className="pas-label">
                    Task Start Date <span className="text-rose-500">*</span>
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
                    Task End Date <span className="text-rose-500">*</span>
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
                  {/* <input
                    type="text"
                    className="pas-input bg-slate-50 text-slate-500"
                    value="Assigned"
                    readOnly
                  /> */}
                  <select
                    className="pas-input"
                    {...register("status", { required: "Required" })}
                  >
                    <option value="">Select status</option>
                    {statusOptions.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="pas-error">{errors.status.message}</p>
                  )}
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

            <div>
              <label className="pas-label">
                Remark <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Remark"
                className="pas-input"
                {...register("actionRemark")}
              />
            </div>



            {/* Multiple Document Upload */}
            <div>
              <label className="pas-label">
                Documents <span className="text-rose-500">*</span>
              </label>

              <Controller
                name="document"
                control={control}
                rules={{
                  validate: (files) =>
                    files?.length > 0 || "Please upload at least one document",
                }}
                render={({ field }) => {
                  const files = Array.isArray(field.value) ? field.value : [];

                  return (
                    <div className="space-y-3">

                      {/* Upload Area */}
                      <label
                        htmlFor="task-document"
                        className="flex flex-col items-center justify-center w-full p-6
            border-2 border-dashed border-slate-300 rounded-xl
            bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400
            cursor-pointer transition-all"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100
            flex items-center justify-center mb-3">
                          <UploadCloud className="w-6 h-6 text-blue-600" />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                          Click to upload documents
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Multiple files allowed · Each file must be smaller than 10 MB
                        </p>

                        <input
                          id="task-document"
                          type="file"
                          multiple
                          className="hidden"
                          onBlur={field.onBlur}
                          onChange={async (e) => {
                            const selectedFiles = Array.from(e.target.files || []);

                            if (!selectedFiles.length) return;

                            // Validate file size (each file must be less than 10 MB)
                            const invalidFiles = selectedFiles.filter(
                              (file) => file.size >= MAX_FILE_SIZE
                            );

                            if (invalidFiles.length > 0) {
                              toast.error(
                                `These files must be smaller than 10 MB: ${invalidFiles
                                  .map((file) => file.name)
                                  .join(", ")}`
                              );

                              e.target.value = "";
                              return;
                            }

                            try {
                              const convertedFiles = await Promise.all(
                                selectedFiles.map(async (file) => {
                                  const base64 = await fileToBase64(file);

                                  return {
                                    fileName: file.name,
                                    fileType: file.type || "application/octet-stream",
                                    fileSize: file.size,
                                    base64,
                                  };
                                })
                              );

                              const existingFiles = Array.isArray(field.value)
                                ? field.value
                                : [];

                              field.onChange([...existingFiles, ...convertedFiles]);

                            } catch (error) {
                              console.error(error);
                              toast.error("Unable to process selected files");
                            }

                            e.target.value = "";
                          }}
                        />
                      </label>

                      {/* Selected Files */}
                      {files.length > 0 && (
                        <div className="space-y-2">

                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-700">
                              Selected Documents ({files.length})
                            </p>

                            <span className="text-xs font-medium text-blue-600">
                              {files.length} file(s)
                            </span>
                          </div>

                          {files.map((file, index) => (
                            <div
                              key={`${file.fileName}-${index}`}
                              className="flex items-center justify-between gap-3
                  p-3 rounded-xl border border-blue-200 bg-blue-50/50"
                            >
                              <div className="flex items-center gap-3 min-w-0">

                                <div className="w-10 h-10 shrink-0 rounded-lg
                    bg-blue-100 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {file.fileName}
                                  </p>

                                  <p className="text-xs text-slate-500 mt-1">
                                    {file.fileType}
                                    {" · "}
                                    {formatFileSize(file.fileSize)}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(
                                    files.filter((_, i) => i !== index)
                                  );
                                }}
                                className="p-2 shrink-0 rounded-lg text-rose-500
                    hover:bg-rose-100 transition-colors"
                                title="Remove document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {errors.document && (
                        <p className="pas-error">
                          {errors.document.message}
                        </p>
                      )}
                    </div>
                  )
                }}
              />
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
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
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
