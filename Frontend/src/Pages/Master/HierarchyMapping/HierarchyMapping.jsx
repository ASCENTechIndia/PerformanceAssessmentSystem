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

const HierarchyMapping = () => {
    const { setLoading } = useLoader();

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
            designationLevel: "",
            reportingOfficer: ""
        }
    });

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
                        <Label 
                            text={"Designation Level"}
                            required
                        />

                        <select
                            id="designation"
                            className="pas-input"
                            aria-invalid={!!errors.designationLevel}
                            {...register("designationLevel", { required: "Designation Level is required" })}
                        >
                            <option value="">Select designation…</option>
                            {[].map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        {errors.designationLevel && (
                            <p className="pas-error">{errors.designationLevel.message}</p>
                        )}
                    </div>
                    <div>
                        <Label 
                            text={"Hierarchy Level"}
                            required
                        />

                        <select
                            id="HierarchyLevel"
                            className="pas-input"
                            aria-invalid={!!errors.reportingOfficer}
                            {...register("reportingOfficer", { required: "Reporting Officer is required" })}
                        >
                            <option value="">Select officer…</option>
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