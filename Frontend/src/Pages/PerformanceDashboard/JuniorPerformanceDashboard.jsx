
import React, { useMemo, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  MessageCircle,
  CalendarClock,
  RotateCcw,
  FileText,
  Send,
} from "lucide-react";

import Layout from "../../Components/Layout";

import {
  TASKS,
  EXTENSION_REQUESTS,
  QUERIES,
  getMetrics,
  formatDate,
} from "./performanceData";

import {
  PerformanceCards,
  StatusBadge,
} from "./dashboardcomponents/PerfomanceMetrics";

import TaskPerformanceTable from "./dashboardcomponents/TaskPerfomanceTable";

const JuniorPerformanceDashboard = () => {
  // Replace with logged-in user's actual ID.
  const loggedInEmployeeId = "e101";

  const [period, setPeriod] = useState("90");

  // My tasks only
  const myTasks = useMemo(() => {
    let result = TASKS.filter(
      (task) => task.employeeId === loggedInEmployeeId
    );

    if (period !== "all") {
      result = result.filter((task) => {
        const days =
          (new Date().setHours(0, 0, 0, 0) -
            new Date(`${task.assignedAt}T00:00:00`).getTime()) /
          86400000;

        return days >= 0 && days <= Number(period);
      });
    }

    return result;
  }, [period]);

  const metrics = useMemo(
    () => getMetrics(myTasks),
    [myTasks]
  );

  // Task categories
  const overdueTasks = myTasks.filter(
    (task) =>
      task.status === "Overdue" ||
      (
        task.status !== "Completed" &&
        task.approvedDeadline <
          new Date().toISOString().split("T")[0]
      )
  );

  const inProgressTasks = myTasks.filter(
    (task) => task.status === "In Progress"
  );

  const reopenedTasks = myTasks.filter(
    (task) => task.status === "Reopened"
  );

  const reworkTasks = myTasks.filter(
    (task) => task.status === "Rework"
  );

  // My extension requests and queries
  const myExtensions = EXTENSION_REQUESTS.filter(
    (request) => request.employeeId === loggedInEmployeeId
  );

  const myQueries = QUERIES.filter(
    (query) => query.employeeId === loggedInEmployeeId
  );

  const stats = [
    {
      label: "Assigned Tasks",
      value: metrics.total,
      icon: ClipboardList,
      color: "text-blue-600",
    },
    {
      label: "Completed Tasks",
      value: metrics.completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      label: "In Progress",
      value: inProgressTasks.length,
      icon: Clock3,
      color: "text-blue-600",
    },
    {
      label: "Overdue Tasks",
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: "text-rose-600",
    },
  ];

  return (
    <Layout
      title="My Performance Dashboard"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "My Performance",
      }}
    >
      <div className="space-y-5">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              My Performance Overview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Track your task progress, deadlines and performance.
            </p>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <Icon size={19} className={item.color} />
                </div>

                <div>
                  <p className="text-[10px] text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics */}

        <div>
          <h3 className="text-[13px] font-bold text-slate-700 mb-3">
            My Performance Indicators
          </h3>

          <PerformanceCards metrics={metrics} />
        </div>

        {/* Additional Metrics */}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">

          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Clock3 size={17} className="text-amber-600" />
              <p className="text-[10px] text-slate-500">
                Total Delay
              </p>
            </div>

            <p className="text-lg font-bold text-slate-800 mt-2">
              {metrics.totalDelay} days
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <RotateCcw size={17} className="text-orange-600" />
              <p className="text-[10px] text-slate-500">
                Reopened Tasks
              </p>
            </div>

            <p className="text-lg font-bold text-slate-800 mt-2">
              {metrics.reopenedCount}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText size={17} className="text-rose-600" />
              <p className="text-[10px] text-slate-500">
                Tasks in Rework
              </p>
            </div>

            <p className="text-lg font-bold text-slate-800 mt-2">
              {metrics.reworkCount}
            </p>
          </div>

        </div>

        {/* Tasks Requiring Attention */}

        <div className="bg-white border border-slate-200 rounded-xl p-4">

          <h3 className="text-[13px] font-bold text-slate-800 mb-4">
            Tasks Requiring Attention
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <div className="rounded-lg bg-rose-50 border border-rose-100 p-3">
              <p className="text-[10px] font-semibold text-rose-600">
                OVERDUE
              </p>

              <p className="text-2xl font-bold text-rose-700 mt-1">
                {overdueTasks.length}
              </p>

              <p className="text-[10px] text-rose-500 mt-1">
                Tasks past approved deadline
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 border border-orange-100 p-3">
              <p className="text-[10px] font-semibold text-orange-600">
                REOPENED
              </p>

              <p className="text-2xl font-bold text-orange-700 mt-1">
                {reopenedTasks.length}
              </p>

              <p className="text-[10px] text-orange-500 mt-1">
                Tasks requiring further completion
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
              <p className="text-[10px] font-semibold text-amber-600">
                REWORK
              </p>

              <p className="text-2xl font-bold text-amber-700 mt-1">
                {reworkTasks.length}
              </p>

              <p className="text-[10px] text-amber-600 mt-1">
                Tasks requiring corrections
              </p>
            </div>

          </div>
        </div>

        {/* Extension Requests */}

        <div className="bg-white border border-slate-200 rounded-xl p-4">

          <div className="flex items-center gap-2 mb-4">
            <CalendarClock size={17} className="text-amber-600" />

            <div>
              <h3 className="text-[13px] font-bold text-slate-800">
                My Extension Requests
              </h3>
              <p className="text-[10px] text-slate-400">
                Track your deadline extension approvals.
              </p>
            </div>
          </div>

          {myExtensions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-5">
              No extension requests found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50">
                  <tr className="text-[10px] text-slate-500">
                    <th className="px-3 py-2">Task ID</th>
                    <th className="px-3 py-2">Requested Deadline</th>
                    <th className="px-3 py-2">Reason</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {myExtensions.map((request) => (
                    <tr
                      key={request.id}
                      className="border-t border-slate-100 text-[11px]"
                    >
                      <td className="px-3 py-3 text-slate-700">
                        {request.taskId}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {formatDate(request.requestedDeadline)}
                      </td>

                      <td className="px-3 py-3 text-slate-500">
                        {request.reason}
                      </td>

                      <td className="px-3 py-3">
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Queries */}

        <div className="bg-white border border-slate-200 rounded-xl p-4">

          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={17} className="text-violet-600" />

            <div>
              <h3 className="text-[13px] font-bold text-slate-800">
                My Queries
              </h3>
              <p className="text-[10px] text-slate-400">
                Track questions and responses from your senior.
              </p>
            </div>
          </div>

          {myQueries.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-5">
              No queries found.
            </p>
          ) : (
            <div className="space-y-3">
              {myQueries.map((query) => (
                <div
                  key={query.id}
                  className="border border-slate-100 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-700">
                      {query.taskId}
                    </p>

                    <StatusBadge status={query.status} />
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2">
                    {query.question}
                  </p>

                  {query.response && (
                    <div className="mt-3 bg-emerald-50 p-3 rounded-lg">
                      <p className="text-[10px] font-semibold text-emerald-700">
                        Senior's Response
                      </p>
                      <p className="text-[11px] text-emerald-800 mt-1">
                        {query.response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks */}

        <TaskPerformanceTable tasks={myTasks} />

      </div>
    </Layout>
  );
};

export default JuniorPerformanceDashboard;
