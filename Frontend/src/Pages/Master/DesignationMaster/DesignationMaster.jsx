import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../../Components/Layout";
import { useLoader } from "../../../Context/LoaderContext";
import apiService from "../../../../apiService";
import Label from "../../../Components/Label";

const DesignationMaster = () => {
    const { setLoading } = useLoader();

    const {
        register,
        watch,
        setValue,
        getValues,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            designation: "",
            hierarchyLevel: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title={"Designation Master"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Designation Master"
            }}
        >
            <ToastContainer position="top-right" autoClose={4000} />
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label 
                            text={"Designation"}
                            required
                        />

                        <input
                            id="designation"
                            type="text"
                            placeholder="Enter Designation"
                            className="pas-input"
                            aria-invalid={!!errors.designation}
                            {...register("designation", {
                                required: "Designation is required",
                                minLength: { value: 2, message: "At least 2 characters" },
                                maxLength: { value: 60, message: "Max 60 characters" },
                            })}
                        />
                        {errors.designation && (
                            <p className="pas-error">{errors.designation.message}</p>
                        )}
                    </div>
                    <div>
                        <Label 
                            text={"Hierarchy Level"}
                            required
                        />
                        <select
                            id="hLevel"
                            className="pas-input"
                            aria-invalid={!!errors.hierarchyLevel}
                            {...register("hierarchyLevel", { required: "Hierarchy Level is required" })}
                        >
                            <option value="">Select designation…</option>
                            {[].map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        {errors.hierarchyLevel && (
                            <p className="pas-error">{errors.hierarchyLevel.message}</p>
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
};

export default DesignationMaster;