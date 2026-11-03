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
    const [designation, setDesignation] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [officer, setOfficer] = useState("");
    const [status, setStatus] = useState("");

    return (
        <Layout
            title={"Employee Master"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Employee Master"
            }}
        >
            <form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <Label
                            text={"Name"}
                            required
                        />

                        <CustomInput
                            value={name}
                            onChange={setName}
                            placeholder="Enter name"
                            removeSpecialCharacters
                            allowOnlyLetters
                        />
                    </div>
                    <div>
                        <Label text="Designation" required />

                        <CustomDropdown
                            options={designationOptions}
                            value={designation}
                            onChange={setDesignation}
                            placeholder="-- Select --"
                        />
                    </div>
                    <div>
                        <Label
                            text={"Department"}
                            required
                        />
                        <CustomDropdown
                            options={departmentOptions}
                            value={department}
                            onChange={setDepartment}
                            placeholder="-- Select --"
                        />
                    </div>
                    <div>
                        <Label
                            text={"Reporting Officer"}
                            required
                        />
                        <CustomDropdown
                            options={officerOptions}
                            value={officer}
                            onChange={setOfficer}
                            placeholder="-- Select --"
                        />
                    </div>
                    <div>
                        <Label
                            text={"Status"}
                            required
                        />
                        <CustomDropdown
                            options={statusOptions}
                            value={status}
                            onChange={setStatus}
                            placeholder="-- Select --"
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 bg-white flex-shrink-0">
                    <Button type="submit" size="md">
                        Submit
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => {
                            navigate("/dashboard")
                        }}
                    >
                        Back
                    </Button>
                </div>
            </form>
        </Layout>
    )
}

export default EmployeeMaster;