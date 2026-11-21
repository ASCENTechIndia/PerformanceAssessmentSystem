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
        formState: { errors }
    } = useForm({
        defaultValues: {
            department: "",
            employee: "",
            reportingOfficer: ""
        }
    });

    const watchDepartment = watch("department");
    const watchEmployee = watch("employee");

    const fetchDepartmentDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiClient.get("/getDepartmentDropdown");

            console.log(response);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to fetch departments");
        } finally {
            setLoading(false);
        }
    }

    const onHierarchyMapSubmit = async (data) => {
        try {
            setLoading(true);
            console.log(data);
            toast.success("Mapping Data submitted successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to submit mapping data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDepartmentDropdown();
    }, [])

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
                            {[].map((p) => (
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
                            className="pas-input"
                            aria-invalid={!!errors.employee}
                            {...register("employee", { required: "Employee is required" })}
                        >
                            <option value="">Select Employee…</option>
                            {[].map((p) => (
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
                            className="pas-input"
                            aria-invalid={!!errors.reportingOfficer}
                            {...register("reportingOfficer", { required: "Reporting Officer is required" })}
                        >
                            <option value="">Select Officer…</option>
                            {[].map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        {errors.reportingOfficer && (
                            <p className="pas-error">{errors.reportingOfficer.message}</p>
                        )}
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