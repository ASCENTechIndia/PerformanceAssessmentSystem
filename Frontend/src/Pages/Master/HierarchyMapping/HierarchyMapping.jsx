import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
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
        } catch (error) {
            console.error(error);
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
                        <label htmlFor="designation" className="pas-label">
                            Designation Level <span className="text-rose-500">*</span>
                        </label>

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
                        <label htmlFor="reportingOfficer" className="pas-label">
                            Reporting Officer <span className="text-rose-500">*</span>
                        </label>

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
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600
              bg-white border border-slate-200
              hover:bg-slate-50 hover:border-slate-300
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-150"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white
              bg-gradient-to-r from-emerald-500 to-sky-500
              shadow-[0_8px_20px_-8px_rgba(16,185,129,0.7)]
              hover:from-emerald-600 hover:to-sky-600
              active:scale-[0.99]
              transition-all duration-150"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </Layout>
    )
}

export default HierarchyMapping;