
import React, { useMemo, useState } from "react";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock3,
  MessageCircle,
  CalendarClock,
  TrendingUp,
  Search,
  Check,
  X,
} from "lucide-react";

import Layout from "../../Components/Layout";

import {
  TASKS,
  EMPLOYEES,
  EXTENSION_REQUESTS,
  QUERIES,
  getMetrics,
  getEmployeeName,
  formatDate,
} from "./performanceData";

import {
  PerformanceCards,
  StatusBadge,
} from "./dashboardcomponents/PerfomanceMetrics";

import TaskPerformanceTable from "./dashboardcomponents/TaskPerfomanceTable";

const SeniorPerformanceDashboard = () => {
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [period, setPeriod] = useState("90");
  const [search, setSearch] = useState("");

  // Demo action handlers - replace with API calls.
  const handleExtension = (requestId, action) => {
    console.log("Extension:", requestId, action);
    // await apiService.post("/tasks/extension-response", {
    //   requestId,
    //   status: action,
    // });
  };

  const handleQueryResponse = (queryId) => {
    console.log("Respond to query:", queryId);
    // Navigate to query response page or open modal.
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = [...TASKS];

    if (employeeFilter !== "all") {
      result = result.filter(
        (task) => task.employeeId === employeeFilter
      );
    }

    if (period !== "all") {
      result = result.filter((task) => {
        const days =
          (new Date().setHours(0, 0, 0, 0) -
            new Date(`${task.assignedAt}T00:00:00`).getTime()) /
          86400000;

        return days >= 0 && days <= Number(period);
      });
    }

    if (search.trim()) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [employeeFilter, period, search]);

  const metrics = useMemo(
    () => getMetrics(filteredTasks),
    [filteredTasks]
  );

  // Employee-wise performance
  const employeePerformance = useMemo(() => {
    return EMPLOYEES
      .filter(
        (employee) =>
          employeeFilter === "all" ||
          employee.id === employeeFilter
      )
      .map((employee) => {
        const employeeTasks = filteredTasks.filter(
          (task) => task.employeeId === employee.id
        );

        return {
          ...employee,
          ...getMetrics(employeeTasks),
        };
      });
  }, [filteredTasks, employeeFilter]);

  // Requests and queries
  const pendingExtensions = EXTENSION_REQUESTS.filter(
    (request) =>
      request.status === "Pending" &&
      (employeeFilter === "all" ||
        request.employeeId === employeeFilter)
  );

  const pendingQueries = QUERIES.filter(
    (query) =>
      query.status === "Pending" &&
      (employeeFilter === "all" ||
        query.employeeId === employeeFilter)
  );

  const secondaryMetrics = [
    {
      label: "Total Assigned",
      value: metrics.total,
      icon: ClipboardList,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: metrics.completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      label: "Pending",
      value: metrics.pending,
      icon: Clock3,
      color: "text-amber-600",
    },
    {
      label: "Total Delay",
      value: `${metrics.totalDelay} days`,
      icon: TrendingUp,
      color: "text-rose-600",
    },
  ];

  return (
    <Layout
      title="Senior Performance Dashboard"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Senior Performance",
      }}
    >
      <div className="space-y-5">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Team Performance Overview
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Monitor junior employee productivity and task performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>

            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
            >
              <option value="all">All Junior Employees</option>
              {EMPLOYEES.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Cards */}

        <div>
          <h3 className="text-[13px] font-bold text-slate-700 mb-3">
            Team Performance Indicators
          </h3>

          <PerformanceCards metrics={metrics} />
        </div>

        {/* Secondary Statistics */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {secondaryMetrics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3"
              >
                <Icon size={20} className={item.color} />
                <div>
                  <p className="text-[10px] text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-base font-bold text-slate-800">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Employee Performance */}

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={17} className="text-slate-600" />
            <div>
              <h3 className="text-[13px] font-bold text-slate-800">
                Employee-wise Performance
              </h3>
              <p className="text-[10px] text-slate-400">
                Compare on-time completion among junior employees.
              </p>
            </div>
          </div>

          <div className="space-y-5">
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
                    className="h-full rounded-full bg-emerald-500"
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

        {/* Extension Requests and Queries */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Extension Requests */}

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">
                  Extension Requests
                </h3>
                <p className="text-[10px] text-slate-400">
                  Review deadline extension requests.
                </p>
              </div>

              <StatusBadge status="Pending" />
            </div>

            {pendingExtensions.length === 0 ? (
              <p className="text-xs text-slate-400 py-5 text-center">
                No pending extension requests.
              </p>
            ) : (
              pendingExtensions.map((request) => (
                <div
                  key={request.id}
                  className="border border-slate-100 rounded-lg p-3 mb-3"
                >
                  <p className="text-xs font-semibold text-slate-700">
                    {TASKS.find((task) => task.id === request.taskId)?.title}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {getEmployeeName(request.employeeId)}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-2">
                    Requested deadline:{" "}
                    <b className="text-amber-600">
                      {formatDate(request.requestedDeadline)}
                    </b>
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    Reason: {request.reason}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleExtension(request.id, "Approved")
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-semibold"
                    >
                      <Check size={13} /> Approve
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleExtension(request.id, "Rejected")
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-md text-[10px] font-semibold"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Queries */}

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">
                  Pending Queries
                </h3>
                <p className="text-[10px] text-slate-400">
                  Questions raised by junior employees.
                </p>
              </div>

              <MessageCircle size={18} className="text-violet-500" />
            </div>

            {pendingQueries.length === 0 ? (
              <p className="text-xs text-slate-400 py-5 text-center">
                No pending queries.
              </p>
            ) : (
              pendingQueries.map((query) => (
                <div
                  key={query.id}
                  className="border border-slate-100 rounded-lg p-3 mb-3"
                >
                  <p className="text-xs font-semibold text-slate-700">
                    {TASKS.find((task) => task.id === query.taskId)?.title}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {getEmployeeName(query.employeeId)}
                  </p>

                  <p className="text-[11px] text-slate-600 mt-3">
                    {query.question}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleQueryResponse(query.id)}
                    className="mt-3 px-3 py-1.5 rounded-md bg-violet-50 text-violet-700 text-[10px] font-semibold"
                  >
                    Respond to Query
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Task Search */}

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search task by name or ID..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-emerald-400"
          />
        </div>

        {/* Task Details */}

        <TaskPerformanceTable
          tasks={filteredTasks}
          showEmployee
        />

      </div>
    </Layout>
  );
};

export default SeniorPerformanceDashboard;
