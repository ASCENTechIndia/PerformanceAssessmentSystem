import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import Button from "../../../Components/Button";
import { toast } from "sonner";
import apiClient from "../../../../apiClient";


const HierarchyMapping = () => {
    const { setLoading } = useLoader();
    const { user } = useAuth();
    const ulbId = user?.ulbId;
    const userId = user?.userId;
    const navigate = useNavigate();

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [officerOptions, setOfficerOptions] = useState([]);

    const {
        register,
        watch,
        setValue,
        getValues,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            department: "",
            employee: "",
            reportingOfficer: "",
            active: true
        }
    });

    const watchDepartment = watch("department");
    const watchEmployee = watch("employee");

    const fetchDepartmentDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiClient.get("/getDepartmentDropdown");

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const formatted = response.data.map(item => ({
                    label: item.DEPT_NAME,
                    value: item.DEPT_ID
                }));
                setDepartmentOptions(formatted);
            } else {
                setDepartmentOptions([]);
            }
        } catch (err) {
            setDepartmentOptions([]);
            console.error(err);
            toast.error(err.message || "Failed to fetch departments");
        } finally {
            setLoading(false);
        }
    }

    const fetchEmployeeDropdown = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/getEmployeeDropdown?deptId=${encodeURIComponent(watchDepartment)}&ulbId=${ulbId}`);
            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const formatted = response.data.map(item => ({
                    label: `${item.EMPLOYEE_NAME} - ${item.DESI_NAME}`,
                    value: item.EMPID
                }));
                setEmployeeOptions(formatted);
            } else {
                setEmployeeOptions([]);
            }
        } catch (err) {
            setEmployeeOptions([]);
            console.error(err);
            toast.error(err.message || "Failed to fetch departments");
        } finally {
            setLoading(false);
        }
    }

    const onHierarchyMapSubmit = async (data) => {
        try {
            setLoading(true);

            const mappingPayload = {
                "IN_MODE": 1,
                "IN_ULBID": Number(ulbId),
                "IN_EMPLOYEE_ID": Number(data.employee),
                "IN_REPORTINGTO": Number(data.reportingOfficer),
                "IN_ISACTIVE": data.active ? "Y" : "N",
                "IN_USERID": userId
            }

            const response = await apiClient.post("/aopt_employee_mapping_insupd", mappingPayload);

            if (response.success && response.errorCode === 9999) {
                toast.success(response.errorMessage);
                reset();
                navigate("/master/HierarchyMapping", {
                    replace: true
                });
            } else {
                toast.error(response.errorMessage);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to submit mapping data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDepartmentDropdown();
    }, []);

    useEffect(() => {
        if (ulbId && watchDepartment) {
            fetchEmployeeDropdown();
        }
    }, [ulbId, watchDepartment]);

    useEffect(() => {
        if (watchEmployee && employeeOptions.length) {
            const officers = employeeOptions.filter(item => String(item.value) !== String(encodeURIComponent(watchEmployee)));
            setOfficerOptions(officers);
        }
    }, [watchEmployee, employeeOptions]);

    return (
        <Layout
            title={"Hierarchy Mapping"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Hierarchy Mapping"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(onHierarchyMapSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <label className="pas-label" htmlFor="department">
                            Department <span className="text-rose-500">*</span>
                        </label>

                        <select
                            id="department"
                            className="pas-input"
                            aria-invalid={!!errors.department}
                            {...register("department", { required: "Department is required" })}
                        >
                            <option value="">Select Department…</option>
                            {departmentOptions.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="pas-error">{errors.department.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            className="pas-label"
                            htmlFor="employee"
                        >
                            Employee <span className="text-rose-500">*</span>
                        </label>

                        <select
                            id="employee"
                            className={`pas-input ${watchDepartment ? "" : "cursor-not-allowed"}`}
                            disabled={!watchDepartment}
                            aria-invalid={!!errors.employee}
                            {...register("employee", { required: "Employee is required" })}
                        >
                            <option value="">Select Employee…</option>
                            {employeeOptions.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        {errors.employee && (
                            <p className="pas-error">{errors.employee.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            className="pas-label"
                            htmlFor="reportingOfficer"
                        >
                            Reporting Officer <span className="text-rose-500">*</span>
                        </label>

                        <select
                            id="reportingOfficer"
                            className={`pas-input ${watchEmployee ? "" : "cursor-not-allowed"}`}
                            disabled={!watchEmployee}
                            aria-invalid={!!errors.reportingOfficer}
                            {...register("reportingOfficer", { required: "Reporting Officer is required" })}
                        >
                            <option value="">Select Officer…</option>
                            {officerOptions.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        {errors.reportingOfficer && (
                            <p className="pas-error">{errors.reportingOfficer.message}</p>
                        )}
                    </div>
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
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => reset()}
                        // disabled={!isDirty}
                        className="reset-btn"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </Layout>
    )
}

export default HierarchyMapping;