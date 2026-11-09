
import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FileText,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import Layout from "../../Components/Layout";

// --------------------------------------------------
// DUMMY DATA - Replace with API responses
// --------------------------------------------------

const EMPLOYEES = [
  { id: "e101", name: "Ravi Sharma", department: "IT" },
  { id: "e102", name: "Priya Menon", department: "IT" },
  { id: "e103", name: "Amit Patel", department: "IT" },
  { id: "e104", name: "Sneha Iyer", department: "IT" },
];

const TASKS = [
  {
    id: "TSK-101",
    title: "Property Tax Module Inspection",
    employeeId: "e101",
    type: "Inspection",
    priority: "High",
    status: "Completed",
    assignedAt: dateOffset(-40),
    originalDeadline: dateOffset(-25),
    approvedDeadline: dateOffset(-25),
    completedAt: dateOffset(-27),
    reopenCount: 0,
    reworkCount: 0,
  },
  {
    id: "TSK-102",
    title: "Water Billing Report Verification",
    employeeId: "e102",
    type: "Audit",
    priority: "Medium",
    status: "Completed",
    assignedAt: dateOffset(-35),
    originalDeadline: dateOffset(-25),
    approvedDeadline: dateOffset(-22),
    completedAt: dateOffset(-19),
    reopenCount: 1,
    reworkCount: 0,
  },
  {
    id: "TSK-103",
    title: "Database Performance Review",
    employeeId: "e103",
    type: "Review",
    priority: "High",
    status: "Completed",
    assignedAt: dateOffset(-30),
    originalDeadline: dateOffset(-18),
    approvedDeadline: dateOffset(-18),
    completedAt: dateOffset(-17),
    reopenCount: 0,
    reworkCount: 1,
  },
  {
    id: "TSK-104",
    title: "Monthly Department Report",
    employeeId: "e101",
    type: "Report",
    priority: "Low",
    status: "Completed",
    assignedAt: dateOffset(-25),
    originalDeadline: dateOffset(-15),
    approvedDeadline: dateOffset(-15),
    completedAt: dateOffset(-16),
    reopenCount: 0,
    reworkCount: 0,
  },
  {
    id: "TSK-105",
    title: "Water Connection Data Audit",
    employeeId: "e104",
    type: "Audit",
    priority: "High",
    status: "Completed",
    assignedAt: dateOffset(-24),
    originalDeadline: dateOffset(-12),
    approvedDeadline: dateOffset(-12),
    completedAt: dateOffset(-9),
    reopenCount: 1,
    reworkCount: 1,
  },
  {
    id: "TSK-106",
    title: "API Integration Testing",
    employeeId: "e102",
    type: "Inspection",
    priority: "Medium",
    status: "Completed",
    assignedAt: dateOffset(-20),
    originalDeadline: dateOffset(-8),
    approvedDeadline: dateOffset(-8),
    completedAt: dateOffset(-8),
    reopenCount: 0,
    reworkCount: 0,
  },
  {
    id: "TSK-107",
    title: "Receipt Generation Bug Fix",
    employeeId: "e103",
    type: "Review",
    priority: "High",
    status: "Reopened",
    assignedAt: dateOffset(-15),
    originalDeadline: dateOffset(-5),
    approvedDeadline: dateOffset(-5),
    completedAt: null,
    reopenCount: 1,
    reworkCount: 0,
  },
  {
    id: "TSK-108",
    title: "User Access Module Testing",
    employeeId: "e104",
    type: "Inspection",
    priority: "Medium",
    status: "Rework",
    assignedAt: dateOffset(-12),
    originalDeadline: dateOffset(-2),
    approvedDeadline: dateOffset(-2),
    completedAt: null,
    reopenCount: 0,
    reworkCount: 1,
  },
  {
    id: "TSK-109",
    title: "Water Connection Configuration",
    employeeId: "e101",
    type: "Review",
    priority: "High",
    status: "In Progress",
    assignedAt: dateOffset(-5),
    originalDeadline: dateOffset(5),
    approvedDeadline: dateOffset(5),
    completedAt: null,
    reopenCount: 0,
    reworkCount: 0,
    extensionStatus: "Pending",
    requestedDeadline: dateOffset(9),
  },
  {
    id: "TSK-110",
    title: "Complaint Management Report",
    employeeId: "e102",
    type: "Report",
    priority: "Medium",
    status: "Query Raised",
    assignedAt: dateOffset(-4),
    originalDeadline: dateOffset(6),
    approvedDeadline: dateOffset(6),
    completedAt: null,
    reopenCount: 0,
    reworkCount: 0,
    queryStatus: "Pending",
  },
  {
    id: "TSK-111",
    title: "Property Search Optimization",
    employeeId: "e104",
    type: "Inspection",
    priority: "High",
    status: "Overdue",
    assignedAt: dateOffset(-15),
    originalDeadline: dateOffset(-2),
    approvedDeadline: dateOffset(-2),
    completedAt: null,
    reopenCount: 0,
    reworkCount: 0,
  },
  {
    id: "TSK-112",
    title: "Department Workflow Documentation",
    employeeId: "e103",
    type: "Report",
    priority: "Low",
    status: "Completed",
    assignedAt: dateOffset(-50),
    originalDeadline: dateOffset(-35),
    approvedDeadline: dateOffset(-35),
    completedAt: dateOffset(-35),
    reopenCount: 0,
    reworkCount: 0,
  },
];

// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

function dateOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

const dayDifference = (date1, date2) => {
  return Math.round(
    (new Date(`${date1}T00:00:00Z`) -
      new Date(`${date2}T00:00:00Z`)) /
      86400000
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getMetrics = (tasks) => {
  const completed = tasks.filter(
    (task) => task.status === "Completed" && task.completedAt
  );

  const onTime = completed.filter(
    (task) =>
      dayDifference(task.completedAt, task.approvedDeadline) <= 0
  );

  const lateTasks = completed
    .map((task) =>
      dayDifference(task.completedAt, task.approvedDeadline)
    )
    .filter((days) => days > 0);

  const reopened = tasks.filter(
    (task) => task.reopenCount > 0
  );

  const rework = tasks.filter(
    (task) => task.reworkCount > 0
  );

  const totalDelay = lateTasks.reduce(
    (total, days) => total + days,
    0
  );

  return {
    total: tasks.length,
    completed: completed.length,
    pending: tasks.filter(
      (task) =>
        !["Completed"].includes(task.status)
    ).length,

    onTimeCount: onTime.length,

    onTimeRate: completed.length
      ? (onTime.length / completed.length) * 100
      : 0,

    averageDelay: lateTasks.length
      ? totalDelay / lateTasks.length
      : 0,

    totalDelay,

    reopenedCount: reopened.length,

    reworkCount: rework.length,

    reworkRate: tasks.length
      ? (rework.length / tasks.length) * 100
      : 0,

    lateCount: lateTasks.length,
  };
};

// --------------------------------------------------
// REUSABLE COMPONENTS
// --------------------------------------------------

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={19} />
      </div>

      {trend && (
        <span className="text-[10px] font-medium text-slate-500">
          {trend}
        </span>
      )}
    </div>

    <p className="text-[11px] font-medium text-slate-500 mt-4">
      {title}
    </p>

    <h3 className="text-2xl font-bold text-slate-800 mt-1">
      {value}
    </h3>

    <p className="text-[10px] text-slate-400 mt-1">
      {subtitle}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    "In Progress": "bg-blue-50 text-blue-700",
    "Query Raised": "bg-violet-50 text-violet-700",
    "Extension Requested": "bg-amber-50 text-amber-700",
    Reopened: "bg-orange-50 text-orange-700",
    Rework: "bg-rose-50 text-rose-700",
    Overdue: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

const SectionTitle = ({ title, subtitle, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
      <Icon size={16} className="text-slate-600" />
    </div>

    <div>
      <h3 className="text-[13px] font-bold text-slate-800">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[10px] text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

// --------------------------------------------------
// MAIN DASHBOARD
// --------------------------------------------------

const PerformanceDashboard = () => {
  // Change this based on logged-in employee role.
  const [role, setRole] = useState("Senior");

  // Junior employee ID from authenticated user.
  const loggedInEmployeeId = "e101";

  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [period, setPeriod] = useState("90");

  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // FILTER TASKS
  // --------------------------------------------------

  const filteredTasks = useMemo(() => {
    let result = [...TASKS];

    if (role === "Junior") {
      result = result.filter(
        (task) => task.employeeId === loggedInEmployeeId
      );
    } else if (employeeFilter !== "all") {
      result = result.filter(
        (task) => task.employeeId === employeeFilter
      );
    }

    if (period !== "all") {
      result = result.filter(
        (task) =>
          dayDifference(
            dateOffset(0),
            task.assignedAt
          ) <= Number(period)
      );
    }

    if (search.trim()) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [role, employeeFilter, period, search]);

  const metrics = useMemo(
    () => getMetrics(filteredTasks),
    [filteredTasks]
  );

  // --------------------------------------------------
  // EMPLOYEE-WISE PERFORMANCE
  // --------------------------------------------------

  const employeePerformance = useMemo(() => {
    const employees =
      role === "Junior"
        ? EMPLOYEES.filter(
            (emp) => emp.id === loggedInEmployeeId
          )
        : EMPLOYEES.filter(
            (emp) =>
              employeeFilter === "all" ||
              emp.id === employeeFilter
          );

    return employees.map((employee) => {
      const employeeTasks = TASKS.filter(
        (task) => task.employeeId === employee.id
      );

      return {
        ...employee,
        ...getMetrics(employeeTasks),
      };
    });
  }, [role, employeeFilter]);

  // --------------------------------------------------
  // STATUS DISTRIBUTION
  // --------------------------------------------------

  const statusList = [
    { name: "Completed", color: "bg-emerald-500" },
    { name: "In Progress", color: "bg-blue-500" },
    { name: "Reopened", color: "bg-orange-500" },
    { name: "Rework", color: "bg-rose-500" },
    { name: "Overdue", color: "bg-red-500" },
    { name: "Query Raised", color: "bg-violet-500" },
  ];

  const statusCounts = statusList.map((item) => ({
    ...item,
    count: filteredTasks.filter(
      (task) => task.status === item.name
    ).length,
  }));

  // --------------------------------------------------
  // PENDING REQUESTS
  // --------------------------------------------------

  const extensionRequests = filteredTasks.filter(
    (task) => task.extensionStatus === "Pending"
  );

  const pendingQueries = filteredTasks.filter(
    (task) => task.queryStatus === "Pending"
  );

  const today = dateOffset(0);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <Layout
      title="Performance Dashboard"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Performance Dashboard",
      }}
    >
      <div className="space-y-5">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Performance Overview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Monitor task completion, deadlines and employee productivity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            {/* ROLE SWITCH - DEMO */}

            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              {["Senior", "Junior"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setRole(item);
                    setEmployeeFilter("all");
                    setSearch("");
                  }}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition ${
                    role === item
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* DATE FILTER */}

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white outline-none"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>

          </div>
        </div>

        {/* FILTERS */}

        {role === "Senior" && (
          <div className="flex flex-col sm:flex-row gap-3">

            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-emerald-400"
              />
            </div>

            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white outline-none"
            >
              <option value="all">All Employees</option>

              {EMPLOYEES.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>

          </div>
        )}

        {/* PERFORMANCE METRICS */}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-slate-700">
              Key Performance Indicators
            </h3>

            <span className="text-[10px] text-slate-400">
              {metrics.total} assigned tasks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

            <MetricCard
              title="On-Time Completion"
              value={`${metrics.onTimeRate.toFixed(1)}%`}
              subtitle={`${metrics.onTimeCount} of ${metrics.completed} completed tasks`}
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-600"
            />

            <MetricCard
              title="Average Delay"
              value={`${metrics.averageDelay.toFixed(1)} days`}
              subtitle={`${metrics.lateCount} late completed tasks`}
              icon={Clock3}
              color="bg-amber-50 text-amber-600"
            />

            <MetricCard
              title="Reopened Tasks"
              value={metrics.reopenedCount}
              subtitle="Unique tasks reopened"
              icon={RotateCcw}
              color="bg-orange-50 text-orange-600"
            />

            <MetricCard
              title="Rework Rate"
              value={`${metrics.reworkRate.toFixed(1)}%`}
              subtitle={`${metrics.reworkCount} tasks sent for rework`}
              icon={Wrench}
              color="bg-rose-50 text-rose-600"
            />

          </div>
        </div>

        {/* SECONDARY METRICS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          {[
            {
              title: "Total Assigned",
              value: metrics.total,
              icon: ClipboardList,
              color: "text-blue-600",
            },
            {
              title: "Completed",
              value: metrics.completed,
              icon: CheckCircle2,
              color: "text-emerald-600",
            },
            {
              title: "Pending",
              value: metrics.pending,
              icon: Activity,
              color: "text-amber-600",
            },
            {
              title: "Total Delay",
              value: `${metrics.totalDelay} days`,
              icon: CalendarClock,
              color: "text-rose-600",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3"
              >
                <Icon size={19} className={item.color} />

                <div>
                  <p className="text-[10px] text-slate-500">
                    {item.title}
                  </p>

                  <p className="text-base font-bold text-slate-800">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        {/* ANALYTICS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* STATUS DISTRIBUTION */}

          <div className="bg-white border border-slate-200 rounded-xl p-4">

            <SectionTitle
              title="Task Status Distribution"
              subtitle="Current status of assigned tasks"
              icon={Activity}
            />

            <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 mb-5">
              {statusCounts.map((item) => (
                item.count > 0 && (
                  <div
                    key={item.name}
                    className={item.color}
                    style={{
                      width: `${
                        (item.count / (metrics.total || 1)) * 100
                      }%`,
                    }}
                    title={`${item.name}: ${item.count}`}
                  />
                )
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">

              {statusCounts.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                    />

                    <span className="text-[11px] text-slate-600">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-800">
                    {item.count}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* EMPLOYEE PERFORMANCE */}

          <div className="bg-white border border-slate-200 rounded-xl p-4">

            <SectionTitle
              title="Employee Performance"
              subtitle="On-time completion comparison"
              icon={Users}
            />

            <div className="space-y-4">

              {employeePerformance.map((employee) => (
                <div key={employee.id}>

                  <div className="flex justify-between items-center mb-1.5">

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {employee.name}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {employee.completed} completed / {employee.total} assigned
                      </p>
                    </div>

                    <span className="text-xs font-bold text-slate-700">
                      {employee.onTimeRate.toFixed(1)}%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${employee.onTimeRate}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-slate-400">
                      Reopened: {employee.reopenedCount}
                    </span>

                    <span className="text-[9px] text-slate-400">
                      Rework: {employee.reworkRate.toFixed(1)}%
                    </span>
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>

        {/* REQUESTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* EXTENSION REQUESTS */}

          <div className="bg-white border border-slate-200 rounded-xl p-4">

            <div className="flex items-center justify-between mb-4">

              <SectionTitle
                title="Deadline Extension Requests"
                subtitle="Requests submitted by junior employees"
                icon={CalendarClock}
              />

              <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-1 rounded">
                {extensionRequests.length} Pending
              </span>

            </div>

            {extensionRequests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No pending extension requests.
              </p>
            ) : (
              <div className="space-y-3">

                {extensionRequests.map((task) => {
                  const employee = EMPLOYEES.find(
                    (emp) => emp.id === task.employeeId
                  );

                  return (
                    <div
                      key={task.id}
                      className="border border-slate-100 rounded-lg p-3"
                    >

                      <div className="flex justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-700">
                          {task.title}
                        </p>

                        <StatusBadge status="Extension Requested" />
                      </div>

                      <p className="text-[10px] text-slate-500 mt-1">
                        {employee?.name} · {task.id}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-[10px]">
                        <span className="text-slate-500">
                          Current deadline:{" "}
                          <b className="text-slate-700">
                            {formatDate(task.approvedDeadline)}
                          </b>
                        </span>

                        <span className="text-amber-600">
                          Requested:{" "}
                          <b>
                            {formatDate(task.requestedDeadline)}
                          </b>
                        </span>
                      </div>

                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* QUERIES */}

          <div className="bg-white border border-slate-200 rounded-xl p-4">

            <div className="flex items-center justify-between mb-4">

              <SectionTitle
                title="Pending Task Queries"
                subtitle="Questions raised by junior employees"
                icon={MessageCircle}
              />

              <span className="text-[10px] font-semibold bg-violet-50 text-violet-700 px-2 py-1 rounded">
                {pendingQueries.length} Pending
              </span>

            </div>

            {pendingQueries.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No pending queries.
              </p>
            ) : (
              <div className="space-y-3">

                {pendingQueries.map((task) => {
                  const employee = EMPLOYEES.find(
                    (emp) => emp.id === task.employeeId
                  );

                  return (
                    <div
                      key={task.id}
                      className="border border-slate-100 rounded-lg p-3"
                    >

                      <div className="flex justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-700">
                          {task.title}
                        </p>

                        <StatusBadge status="Query Raised" />
                      </div>

                      <p className="text-[10px] text-slate-500 mt-1">
                        {employee?.name} · {task.id}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-2">
                        Deadline: {formatDate(task.approvedDeadline)}
                      </p>

                    </div>
                  );
                })}

              </div>
            )}
          </div>

        </div>

        {/* TASK DETAILS TABLE */}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="p-4 border-b border-slate-100">
            <SectionTitle
              title="Task Performance Details"
              subtitle="Detailed task completion and deadline analysis"
              icon={FileText}
            />
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left whitespace-nowrap">

              <thead className="bg-slate-50">
                <tr className="text-[10px] uppercase tracking-wide text-slate-500">

                  <th className="px-4 py-3">Task Details</th>

                  <th className="px-4 py-3">Employee</th>

                  <th className="px-4 py-3">Priority</th>

                  <th className="px-4 py-3">Original Deadline</th>

                  <th className="px-4 py-3">Approved Deadline</th>

                  <th className="px-4 py-3">Completed On</th>

                  <th className="px-4 py-3">Delay</th>

                  <th className="px-4 py-3">Reopened</th>

                  <th className="px-4 py-3">Status</th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-8 text-xs text-slate-400"
                    >
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {

                    const employee = EMPLOYEES.find(
                      (emp) => emp.id === task.employeeId
                    );

                    const delay = task.completedAt
                      ? dayDifference(
                          task.completedAt,
                          task.approvedDeadline
                        )
                      : null;

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-slate-50 transition text-[11px]"
                      >

                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-700">
                            {task.title}
                          </p>

                          <p className="text-[9px] text-slate-400 mt-1">
                            {task.id} · {task.type}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {employee?.name}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              task.priority === "High"
                                ? "text-rose-600"
                                : task.priority === "Medium"
                                ? "text-amber-600"
                                : "text-slate-500"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-500">
                          {formatDate(task.originalDeadline)}
                        </td>

                        <td className="px-4 py-3 text-slate-500">
                          {formatDate(task.approvedDeadline)}
                        </td>

                        <td className="px-4 py-3 text-slate-500">
                          {formatDate(task.completedAt)}
                        </td>

                        <td className="px-4 py-3">
                          {delay === null ? (
                            <span className="text-slate-400">-</span>
                          ) : delay > 0 ? (
                            <span className="text-rose-600 font-semibold">
                              +{delay} days
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">
                              {delay === 0
                                ? "On time"
                                : `${Math.abs(delay)} days early`}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {task.reopenCount}
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge status={task.status} />
                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>
            </table>

          </div>
        </div>

        {/* FOOTNOTE */}

        <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">

          <ShieldCheck
            size={16}
            className="text-slate-400 flex-shrink-0 mt-0.5"
          />

          <p className="text-[10px] text-slate-500 leading-relaxed">
            Performance indicators are calculated using the latest
            approved deadlines. Original deadlines are retained for
            audit purposes. Reopened and rework tasks are tracked
            separately to evaluate completion quality.
          </p>

        </div>

      </div>
    </Layout>
  );
};

export default PerformanceDashboard;
