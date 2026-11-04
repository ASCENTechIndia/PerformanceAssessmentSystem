import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import { useAuth } from "../../Context/AuthContext";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import Button from "../../Components/Button";
import { ChevronDown } from "lucide-react";
import CustomDropdown from "../../Components/CustomDropdown";
import CustomInput from "../../Components/CustomInput";
import { toast } from "sonner";


const designationOptions = [
    { label: "Administrator", value: "1" },
    { label: "Manager", value: "2" },
    { label: "Developer", value: "3" },
    { label: "Accountant", value: "4" },
];

const departmentOptions = [
    { label: "Estate", value: "1" },
    { label: "Vibhag", value: "2" },
]

const officerOptions = [
    { label: "Officer 1", value: "1" },
    { label: "Officer 2", value: "2" },
]

const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "2" },
]

const EmployeeMaster = () => {
    const { setLoading } = useLoader();

    const [designation, setDesignation] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [officer, setOfficer] = useState("");
    const [status, setStatus] = useState("");

    const {
        register,
        watch,
        setValue,
        getValues,
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: "",
            designation: "",
            department: "",
            reportingOfficer: "",
            status: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log(data);
            toast.success("Employee Data Submitted Successfully");
            reset();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to submit employee data");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title={"Employee Master"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Employee Master"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label 
                            text={"Name"}
                            required
                        />

                        <input
                            id="Name"
                            type="text"
                            placeholder="Enter Name"
                            className="pas-input"
                            aria-invalid={!!errors.name}
                            {...register("name", {
                                required: "Name is required",
                                minLength: { value: 2, message: "At least 2 characters" },
                                maxLength: { value: 60, message: "Max 60 characters" },
                            })}
                        />
                        {errors.name && (
                            <p className="pas-error">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <Label 
                            text={"Designation"}
                            required
                        />
                        <select
                            id="designation"
                            className="pas-input"
                            aria-invalid={!!errors.designation}
                            {...register("designation", { required: "Designation is required" })}
                        >
                            <option value="">Select designation…</option>
                            {designationOptions.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        {errors.designation && (
                            <p className="pas-error">{errors.designation.message}</p>
                        )}
                    </div>
                    <div>
                        <Label 
                            text={"Department"}
                            required
                        />
                        <select
                            id="department"
                            className="pas-input"
                            aria-invalid={!!errors.department}
                            {...register("department", { required: "Department is required" })}
                        >
                            <option value="">Select department…</option>
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
                        <Label 
                            text={"Reporting Officer"}
                            required
                        />
                        <select
                            id="officer"
                            className="pas-input"
                            aria-invalid={!!errors.reportingOfficer}
                            {...register("reportingOfficer", { required: "Officer is required" })}
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
                        <Label 
                            text={"Status"}
                            required
                        />
                        <select
                            id="status"
                            className="pas-input"
                            aria-invalid={!!errors.status}
                            {...register("status", { required: "Status is required" })}
                        >
                            <option value="">Select Status…</option>
                            {statusOptions.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
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

export default EmployeeMaster;