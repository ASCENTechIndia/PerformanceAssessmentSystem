
import React from "react";
import {
  Building2, ClipboardList, CheckCircle2, Clock,
  AlertTriangle, Users, CalendarDays, Trophy,
} from "lucide-react";

import {
  DashboardHeader, StatCard, Panel, ProgressRow, TaskTable,
} from "./DashboardUI";

const defaultData = {
  stats: {
    ulbs: 12,
    departments: 48,
    totalTasks: 2450,
    completed: 1890,
    pending: 320,
    overdue: 85,
  },
  departments: [
    { name: "Water Supply", completed: 180, total: 200 },
    { name: "Information Technology", completed: 145, total: 160 },
    { name: "Sanitation", completed: 130, total: 155 },
    { name: "Accounts", completed: 110, total: 140 },
    { name: "Public Works", completed: 95, total: 130 },
  ],
  ulbs: [
    { name: "Nagpur Municipal Corp", tasks: 320, completed: 285, rate: 89 },
    { name: "Pune Municipal Corp", tasks: 290, completed: 245, rate: 84 },
    { name: "Mumbai Municipal Corp", tasks: 410, completed: 330, rate: 80 },
    { name: "Nashik Municipal Corp", tasks: 250, completed: 190, rate: 76 },
  ],
  workload: [
    { name: "Water Supply", employees: 45, tasks: 180 },
    { name: "Sanitation", employees: 38, tasks: 155 },
    { name: "IT Department", employees: 25, tasks: 110 },
  ],
  dueTasks: [
    { id: "T-101", title: "Water Pipeline Inspection", dueDate: "Today", priority: "High", status: "In Progress" },
    { id: "T-102", title: "Road Maintenance Report", dueDate: "Today", priority: "Medium", status: "Pending" },
    { id: "T-103", title: "Monthly Collection Report", dueDate: "20 Nov 2026", priority: "High", status: "Pending" },
  ],
};

const CommissionerDashboard = ({ data = defaultData }) => {
  const s = data.stats;

  const completionRate = s.totalTasks
    ? Math.round((s.completed / s.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Commissioner Dashboard"
        subtitle="Organization-wide performance across all ULBs and departments"
        right={
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            Overall Performance
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard title="Total ULBs" value={s.ulbs} subtitle="Across the organization" icon={Building2} tone="blue" />
        <StatCard title="Departments" value={s.departments} subtitle="All registered departments" icon={Users} tone="violet" />
        <StatCard title="Total Tasks" value={s.totalTasks} subtitle="Tasks created across ULBs" icon={ClipboardList} tone="amber" />
        <StatCard title="Completed Tasks" value={s.completed} subtitle={`${completionRate}% completion rate`} icon={CheckCircle2} tone="emerald" />
        <StatCard title="Pending Tasks" value={s.pending} subtitle="Awaiting completion" icon={Clock} tone="amber" />
        <StatCard title="Overdue Tasks" value={s.overdue} subtitle="Require attention" icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Department Performance" subtitle="Completed tasks against total assigned tasks">
          <div className="space-y-5">
            {data.departments.map((d) => (
              <ProgressRow
                key={d.name}
                label={d.name}
                value={d.completed}
                total={d.total}
                color="bg-blue-500"
              />
            ))}
          </div>
        </Panel>

        <Panel title="ULB-wise Performance" subtitle="Task completion across municipal corporations">
          <div className="space-y-4">
            {data.ulbs.map((ulb) => (
              <div key={ulb.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2 mb-1.5">
                    <p className="text-[11.5px] font-medium text-slate-700 truncate">{ulb.name}</p>
                    <span className="text-[11px] font-bold text-slate-700">{ulb.rate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${ulb.rate}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{ulb.completed} of {ulb.tasks} tasks completed</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Employee-wise Workload" subtitle="Task distribution by department">
          <div className="space-y-4">
            {data.workload.map((w) => (
              <div key={w.name} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-700">{w.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{w.employees} employees</p>
                </div>
                <span className="text-sm font-bold text-slate-800">{w.tasks} tasks</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top Performing Departments" subtitle="Based on task completion">
          <div className="space-y-3">
            {data.departments.slice(0, 3).map((d, index) => (
              <div key={d.name} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[11.5px] font-semibold text-slate-700">{index + 1}. {d.name}</p>
                  <p className="text-[10px] text-slate-500">{d.completed} completed out of {d.total}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Tasks Due Today / This Week" subtitle="Organization-wide upcoming tasks">
        <TaskTable tasks={data.dueTasks} showAssignee />
      </Panel>
    </div>
  );
};

export default CommissionerDashboard;
