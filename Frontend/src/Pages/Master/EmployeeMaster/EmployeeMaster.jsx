import { useState, useMemo } from "react";
import Layout from "../../../Components/Layout";
import EmployeeStats from "./EmployeeStats";
import EmployeeFilters from "./EmployeeFilters";
import EmployeeTable from "./EmployeeTable";

/* ---------- Masters ---------- */
const MOCK_DESIGNATIONS = [
  { id: "g1", name: "HOD", level: 1, adminAccess: false },
  { id: "g2", name: "Senior Engineer", level: 2, adminAccess: false },
  { id: "g3", name: "Junior Engineer", level: 3, adminAccess: false },
  { id: "g4", name: "System Admin", level: 2, adminAccess: true },
  { id: "g5", name: "Trainee", level: 5, adminAccess: false },
];

const MOCK_DEPARTMENTS = [
  { id: "d1", name: "Information Technology", code: "IT", active: true },
  { id: "d2", name: "Accounts", code: "ACC", active: true },
  { id: "d3", name: "Human Resources", code: "HR", active: true },
  { id: "d4", name: "Sanitation", code: "SAN", active: true },
  { id: "d5", name: "Water Supply", code: "WS", active: true },
];

const THIS_YEAR = new Date().getFullYear();
const ym = (m, d) =>
  `${THIS_YEAR}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/* ---------- Dummy employees ---------- */
const MOCK_EMPLOYEES = [
  {
    id: "e1",
    empCode: "E001",
    name: "Shri Kumar",
    ulb: "Nagpur Municipal Corp",
    departmentId: "d1",
    designationId: "g1",
    reportingOfficerId: "",
    mobile: "9876543210",
    joiningDate: "2018-04-15",
    active: true,
  },
  {
    id: "e2",
    empCode: "E002",
    name: "Ravi Sharma",
    ulb: "Nagpur Municipal Corp",
    departmentId: "d1",
    designationId: "g2",
    reportingOfficerId: "e1",
    mobile: "9876543211",
    joiningDate: "2019-06-20",
    active: true,
  },
  {
    id: "e3",
    empCode: "E003",
    name: "Priya Menon",
    ulb: "Nagpur Municipal Corp",
    departmentId: "d1",
    designationId: "g3",
    reportingOfficerId: "e2",
    mobile: "9876543212",
    joiningDate: ym(2, 10),
    active: true,
  },
  {
    id: "e4",
    empCode: "E004",
    name: "Amit Patel",
    ulb: "Pune Municipal Corp",
    departmentId: "d2",
    designationId: "g3",
    reportingOfficerId: "e2",
    mobile: "9876543213",
    joiningDate: "2022-08-05",
    active: true,
  },
  {
    id: "e5",
    empCode: "E005",
    name: "Sneha Iyer",
    ulb: "Pune Municipal Corp",
    departmentId: "d3",
    designationId: "g1",
    reportingOfficerId: "",
    mobile: "9876543214",
    joiningDate: "2017-03-12",
    active: true,
  },
  {
    id: "e6",
    empCode: "E006",
    name: "Suresh Rao",
    ulb: "Mumbai Municipal Corp",
    departmentId: "d1",
    designationId: "g4",
    reportingOfficerId: "",
    mobile: "9876543215",
    joiningDate: "2020-11-01",
    active: true,
  },
  {
    id: "e7",
    empCode: "E007",
    name: "Neha Gupta",
    ulb: "Mumbai Municipal Corp",
    departmentId: "d4",
    designationId: "g3",
    reportingOfficerId: "e5",
    mobile: "9876543216",
    joiningDate: ym(3, 5),
    active: true,
  },
  {
    id: "e8",
    empCode: "E008",
    name: "Vikram Joshi",
    ulb: "Nagpur Municipal Corp",
    departmentId: "d5",
    designationId: "g5",
    reportingOfficerId: "e1",
    mobile: "9876543217",
    joiningDate: ym(1, 15),
    active: true,
  },
  {
    id: "e9",
    empCode: "E009",
    name: "Anita Desai",
    ulb: "Pune Municipal Corp",
    departmentId: "d2",
    designationId: "g2",
    reportingOfficerId: "e5",
    mobile: "9876543218",
    joiningDate: "2019-12-03",
    active: false,
  },
  {
    id: "e10",
    empCode: "E010",
    name: "Rohan Mehta",
    ulb: "Nagpur Municipal Corp",
    departmentId: "d1",
    designationId: "g3",
    reportingOfficerId: "e2",
    mobile: "9876543219",
    joiningDate: "2021-05-22",
    active: false,
  },
];

const EMPTY_FILTERS = {
  ulb: "",
  departmentId: "",
  designationId: "",
  status: "",
  empCode: "",
  name: "",
  mobile: "",
};

const EmployeeMaster = () => {
  const [employees] = useState(MOCK_EMPLOYEES);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchUlb = !filters.ulb || e.ulb === filters.ulb;
      const matchDept =
        !filters.departmentId || e.departmentId === filters.departmentId;
      const matchDesig =
        !filters.designationId || e.designationId === filters.designationId;
      const matchStatus =
        !filters.status || (filters.status === "Active" ? e.active : !e.active);
      const matchCode =
        !filters.empCode ||
        e.empCode.toLowerCase().includes(filters.empCode.toLowerCase());
      const matchName =
        !filters.name ||
        e.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchMobile = !filters.mobile || e.mobile.includes(filters.mobile);

      return (
        matchUlb &&
        matchDept &&
        matchDesig &&
        matchStatus &&
        matchCode &&
        matchName &&
        matchMobile
      );
    });
  }, [employees, filters]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <Layout
      title="Employee Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Employees",
      }}
    >
      <div className="space-y-4">
        <EmployeeStats employees={employees} />

        <EmployeeFilters
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
          departments={MOCK_DEPARTMENTS}
          designations={MOCK_DESIGNATIONS}
        />

        <EmployeeTable
          employees={filtered}
          departments={MOCK_DEPARTMENTS}
          designations={MOCK_DESIGNATIONS}
        />

        <p className="text-[11.5px] text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          of {employees.length} employees
          {hasActiveFilters && (
            <span className="ml-1 text-slate-400">· filtered</span>
          )}
        </p>
      </div>
    </Layout>
  );
};

export default EmployeeMaster;
