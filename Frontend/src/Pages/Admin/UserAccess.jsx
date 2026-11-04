import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import { useAuth } from "../../Context/AuthContext";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import Button from "../../Components/Button";
import ConfigTable from "../../Components/ConfigTable.jsx";

const userOptions = [
    { label: "User 1", value: "1" },
    { label: "User 2", value: "2" },
    { label: "User 3", value: "3" },
    { label: "User 4", value: "4" },
    { label: "User 5", value: "5" }
];

const UserAccess = () => {
    const [rows, setRows] = useState([
        {
            id: 1,
            pageName: "Page A"
        },
        {
            id: 2,
            pageName: "Page B"
        },
        {
            id: 3,
            pageName: "Page C"
        },
        {
            id: 4,
            pageName: "Page D"
        },
        {
            id: 5,
            pageName: "Page E"
        }
    ]);

    const [checkedMap, setCheckedMap] = useState({});

    const tableKeyMapping = {
        id: "id",
        columns: {
            pageName: "Page"
        },
    };

    const { setLoading } = useLoader();

    const {
        register,
        setValue,
        reset,
        getValues,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            userName: "",
            pageStr: []
        }
    });

    const [tableHeader, setTableHeader] = useState([
        "Select",
        "Page"
    ]);

    const [tableData, setTableData] = useState();

    const handleToggle = (id, checked) => {
        setCheckedMap((prev) => {
            const updatedMap = {
                ...prev,
                [id]: checked,
            };

            // Get all selected premise IDs
            const selectedIds = rows
                .filter((row) => updatedMap[row.id])
                .map((row) => row.id);

            // Store selected IDs in react-hook-form
            setValue("pageStr", selectedIds, {
                shouldValidate: true,
                shouldDirty: true,
            });

            return updatedMap;
        });
    };


    const handleToggleAll = (checked) => {
        if (checked) {
            const newCheckedMap = {};

            rows.forEach((row) => {
                newCheckedMap[row.id] = true;
            });

            setCheckedMap(newCheckedMap);

            // Store all IDs in react-hook-form
            const selectedIds = rows.map((row) => row.id);

            setValue("pageStr", selectedIds, {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setCheckedMap({});

            // Clear selected IDs from react-hook-form
            setValue("pageStr", [], {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            console.log(data);

            toast.success("User Menu Access details saved successfully");
        } catch (error) {
            console.error(error);

            toast.error(error.message || "Failed to save User Menu Access details");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title={"User Access"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "User Access"
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <div>
                    <Label
                        text={"User: "}
                        required
                    />
                    <select
                        className="pas-input"
                        aria-invalid={!!errors.userName}
                        {...register("userName", { required: "User is required" })}
                    >
                        <option value="">Select User…</option>
                        {userOptions.map((p) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-3">
                    <ConfigTable
                        rows={rows}
                        checkedMap={checkedMap}
                        onToggle={handleToggle}
                        onToggleAll={handleToggleAll}
                        tableKeyMapping={tableKeyMapping}
                    />
                </div>
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => {
                            reset({
                                userName: "",
                                pageStr: []
                            });
                            setCheckedMap({});
                        }}
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

export default UserAccess;


