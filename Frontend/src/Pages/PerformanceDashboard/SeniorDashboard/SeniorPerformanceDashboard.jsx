import { useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import {
  TASKS,
  EMPLOYEES,
  EXTENSION_REQUESTS,
  QUERIES,
  getMetrics,
} from "../performanceData";
import { PerformanceCards } from "../dashboardcomponents/PerfomanceMetrics";
import TaskPerformanceTable from "../dashboardcomponents/TaskPerfomanceTable";
import SeniorStatCard from "./SeniorStatCard";
import EmployeePerformanceList from "./EmployeePerformanceList";
import ExtensionsList from "./ExtensionsList";
import QueriesList from "./QueriesList";

const SeniorPerformanceDashboard = () => {
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [period, setPeriod] = useState("90");
  const [search, setSearch] = useState("");

  const handleExtension = (requestId, action) => {
    toast.success(`Extension ${action.toLowerCase()}: ${requestId}`);
  };
  const handleQueryResponse = (queryId) => {
    toast.info(`Respond to query: ${queryId}`);
  };

  const filteredTasks = useMemo(() => {
    let result = [...TASKS];
    if (employeeFilter !== "all") {
      result = result.filter((t) => t.employeeId === employeeFilter);
    }
    if (period !== "all") {
      result = result.filter((t) => {
        const days =
          (new Date().setHours(0, 0, 0, 0) -
            new Date(`${t.assignedAt}T00:00:00`).getTime()) /
          86_400_000;
        return days >= 0 && days <= Number(period);
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q),
      );
    }
    return result;
  }, [employeeFilter, period, search]);

  const metrics = useMemo(() => getMetrics(filteredTasks), [filteredTasks]);

  const employeePerformance = useMemo(() => {
    return EMPLOYEES.filter(
      (e) => employeeFilter === "all" || e.id === employeeFilter,
    ).map((e) => {
      const empTasks = filteredTasks.filter((t) => t.employeeId === e.id);
      return { ...e, ...getMetrics(empTasks) };
    });
  }, [filteredTasks, employeeFilter]);

  const pendingExtensions = EXTENSION_REQUESTS.filter(
    (r) =>
      r.status === "Pending" &&
      (employeeFilter === "all" || r.employeeId === employeeFilter),
  );
  const pendingQueries = QUERIES.filter(
    (q) =>
      q.status === "Pending" &&
      (employeeFilter === "all" || q.employeeId === employeeFilter),
  );

  return (
    <Layout
      title="Senior Performance"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Senior Performance",
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-slate-800">
              Team Performance Overview
            </h2>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              Monitor junior employee productivity and task performance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="pas-input w-40"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="pas-input w-48"
            >
              <option value="all">All Junior Employees</option>
              {EMPLOYEES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
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

        {/* Secondary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SeniorStatCard
            label="Total Assigned"
            value={metrics.total}
            color="indigo"
            icon={ClipboardList}
          />
          <SeniorStatCard
            label="Completed"
            value={metrics.completed}
            color="emerald"
            icon={CheckCircle2}
          />
          <SeniorStatCard
            label="Pending"
            value={metrics.pending}
            color="amber"
            icon={Clock3}
          />
          <SeniorStatCard
            label="Total Delay"
            value={`${metrics.totalDelay}d`}
            color="rose"
            icon={TrendingUp}
          />
        </div>

        {/* Employee-wise performance */}
        <EmployeePerformanceList employees={employeePerformance} />

        {/* Extensions + Queries */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ExtensionsList
            requests={pendingExtensions}
            onApprove={(id) => handleExtension(id, "Approved")}
            onReject={(id) => handleExtension(id, "Rejected")}
          />
          <QueriesList
            queries={pendingQueries}
            onRespond={handleQueryResponse}
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search task by name or ID…"
            className="pas-input pl-9"
          />
        </div>

        {/* Tasks table */}
        <TaskPerformanceTable tasks={filteredTasks} showEmployee />
      </div>
    </Layout>
  );
};

export default SeniorPerformanceDashboard;
