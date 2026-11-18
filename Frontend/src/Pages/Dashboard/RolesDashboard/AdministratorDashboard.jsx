
import React from "react";
import {
  Users, UserCheck, UserX, Settings, Activity,
  ClipboardList, RotateCcw, Clock, FileText,
  Building2, ShieldCheck,
} from "lucide-react";

import {
  DashboardHeader, StatCard, Panel, ProgressRow, InfoList,
} from "./DashboardUI";

const defaultData = {
  stats: {
    totalUsers: 450,
    activeUsers: 420,
    inactiveUsers: 30,
    totalDepartments: 48,
    totalTasks: 2450,
    reopenedTasks: 18,
    noUpdates: 25,
    pendingConfigurations: 4,
  },
  users: [
    { name: "Ravi Sharma", role: "Junior Employee", action: "Updated task T-401", time: "5 minutes ago" },
    { name: "Sneha Iyer", role: "HOD", action: "Verified task T-205", time: "20 minutes ago" },
    { name: "Suresh Rao", role: "Senior Officer", action: "Reassigned task T-302", time: "1 hour ago" },
    { name: "Amit Kumar", role: "Administrator", action: "Updated department configuration", time: "2 hours ago" },
  ],
  roleDistribution: [
    { role: "Commissioner", count: 12, total: 450 },
    { role: "HOD", count: 48, total: 450 },
    { role: "Senior Officer", count: 90, total: 450 },
    { role: "Junior Employee", count: 280, total: 450 },
    { role: "Administrator", count: 20, total: 450 },
  ],
  configuration: [
    { title: "Department configuration", description: "All department records", time: "Last updated recently", color: "bg-emerald-500" },
    { title: "Designation configuration", description: "Review pending designation changes", time: "Requires review", color: "bg-amber-500" },
    { title: "Role and permission settings", description: "User access configuration", time: "Active", color: "bg-blue-500" },
    { title: "ULB configuration", description: "Municipal corporation details", time: "Active", color: "bg-violet-500" },
  ],
  attachments: [
    { title: "System_Activity_Report.pdf", description: "Latest uploaded report", time: "Today" },
    { title: "Department_Configuration.xlsx", description: "Configuration attachment", time: "Yesterday" },
  ],
  alerts: [
    { title: "25 tasks have no progress updates", description: "Review task activity and follow up.", time: "Monitoring required", color: "bg-amber-500" },
    { title: "18 tasks have been reopened", description: "Review repeated rework cases.", time: "Action required", color: "bg-rose-500" },
  ],
};

const AdministratorDashboard = ({ data = defaultData }) => {
  const s = data.stats;

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Administrator Dashboard"
        subtitle="System overview, user activity and configuration monitoring"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard title="Total Users" value={s.totalUsers} subtitle="Registered system users" icon={Users} tone="blue" />
        <StatCard title="Active Users" value={s.activeUsers} subtitle="Currently active accounts" icon={UserCheck} tone="emerald" />
        <StatCard title="Inactive Users" value={s.inactiveUsers} subtitle="Inactive accounts" icon={UserX} tone="rose" />
        <StatCard title="Departments" value={s.totalDepartments} subtitle="Configured departments" icon={Building2} tone="violet" />
        <StatCard title="Total Tasks" value={s.totalTasks} subtitle="Across the system" icon={ClipboardList} tone="blue" />
        <StatCard title="Reopened Tasks" value={s.reopenedTasks} subtitle="Tasks returned for rework" icon={RotateCcw} tone="rose" />
        <StatCard title="Without Progress Updates" value={s.noUpdates} subtitle="Require monitoring" icon={Clock} tone="amber" />
        <StatCard title="Pending Configurations" value={s.pendingConfigurations} subtitle="Awaiting configuration review" icon={Settings} tone="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="User Role Distribution" subtitle="Number of users assigned to each role">
          <div className="space-y-4">
            {data.roleDistribution.map((role) => (
              <ProgressRow
                key={role.role}
                label={role.role}
                value={role.count}
                total={role.total}
                color="bg-blue-500"
              />
            ))}
          </div>
        </Panel>

        <Panel title="System Configuration" subtitle="Configuration modules and their current state">
          <InfoList items={data.configuration} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Recent User Activity" subtitle="Latest actions performed by system users">
          <div className="space-y-4">
            {data.users.map((user, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-slate-700">{user.name}</p>
                  <p className="text-[10px] text-slate-500">{user.role}</p>
                  <p className="text-[11px] text-slate-600 mt-1">{user.action}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{user.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="System Alerts" subtitle="Items requiring administrator attention">
          <InfoList items={data.alerts} />
        </Panel>
      </div>

      <Panel title="Latest Uploaded Attachments" subtitle="Recently uploaded system documents">
        <InfoList items={data.attachments} />
      </Panel>
    </div>
  );
};

export default AdministratorDashboard;
