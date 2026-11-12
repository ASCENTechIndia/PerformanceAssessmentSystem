import { useMemo, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import Layout from "../../../Components/Layout";
import {
  TASKS,
  EXTENSION_REQUESTS,
  QUERIES,
  getMetrics,
} from "../performanceData";
import { PerformanceCards } from "../dashboardcomponents/PerfomanceMetrics";
import TaskPerformanceTable from "../dashboardcomponents/TaskPerfomanceTable";
import JuniorStatCard from "./JuniorStatCard";
import AttentionCards from "./AttentionCards";
import ExtensionsTable from "./ExtensionsTable";
import QueriesList from "./QueriesList";

const JuniorPerformanceDashboard = () => {
  const loggedInEmployeeId = "e101";
  const [period, setPeriod] = useState("90");

  const myTasks = useMemo(() => {
    let result = TASKS.filter((t) => t.employeeId === loggedInEmployeeId);
    if (period !== "all") {
      result = result.filter((t) => {
        const days =
          (new Date().setHours(0, 0, 0, 0) -
            new Date(`${t.assignedAt}T00:00:00`).getTime()) /
          86_400_000;
        return days >= 0 && days <= Number(period);
      });
    }
    return result;
  }, [period]);

  const metrics = useMemo(() => getMetrics(myTasks), [myTasks]);

  const overdueTasks = myTasks.filter(
    (t) =>
      t.status === "Overdue" ||
      (t.status !== "Completed" &&
        t.approvedDeadline < new Date().toISOString().split("T")[0]),
  );
  const inProgressTasks = myTasks.filter((t) => t.status === "In Progress");
  const reopenedTasks = myTasks.filter((t) => t.status === "Reopened");
  const reworkTasks = myTasks.filter((t) => t.status === "Rework");

  const myExtensions = EXTENSION_REQUESTS.filter(
    (r) => r.employeeId === loggedInEmployeeId,
  );
  const myQueries = QUERIES.filter((q) => q.employeeId === loggedInEmployeeId);

  return (
    <Layout
      title="My Performance"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "My Performance",
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-slate-800">
              My Performance Overview
            </h2>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              Track your task progress, deadlines and performance.
            </p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="pas-input w-44"
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <JuniorStatCard
            label="Assigned Tasks"
            value={metrics.total}
            color="indigo"
            icon={ClipboardList}
          />
          <JuniorStatCard
            label="Completed Tasks"
            value={metrics.completed}
            color="emerald"
            icon={CheckCircle2}
          />
          <JuniorStatCard
            label="In Progress"
            value={inProgressTasks.length}
            color="sky"
            icon={Clock3}
          />
          <JuniorStatCard
            label="Overdue Tasks"
            value={overdueTasks.length}
            color="rose"
            icon={AlertTriangle}
          />
        </div>

        {/* Performance metrics */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-700 mb-3">
            My Performance Indicators
          </h3>
          <PerformanceCards metrics={metrics} />
        </div>

        {/* Attention section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-slate-700">
              Tasks Requiring Attention
            </h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 ring-1 ring-rose-200">
              <Clock3 className="w-3 h-3 text-rose-600" />
              <span className="text-[10.5px] font-semibold text-rose-700">
                Total delay: {metrics.totalDelay} days
              </span>
            </div>
          </div>
          <AttentionCards
            overdueCount={overdueTasks.length}
            reopenedCount={reopenedTasks.length}
            reworkCount={reworkTasks.length}
          />
        </div>

        {/* Extensions + Queries side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ExtensionsTable extensions={myExtensions} />
          <QueriesList queries={myQueries} />
        </div>

        {/* My tasks */}
        <TaskPerformanceTable tasks={myTasks} />
      </div>
    </Layout>
  );
};

export default JuniorPerformanceDashboard;
