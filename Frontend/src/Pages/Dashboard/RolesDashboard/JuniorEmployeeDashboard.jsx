
import React from "react";
import {
  ClipboardList, Clock, PlayCircle, CheckCircle2,
  CalendarDays, AlertTriangle, Paperclip,
} from "lucide-react";

import {
  DashboardHeader, StatCard, Panel, TaskTable, InfoList,
} from "./DashboardUI";

const defaultData = {
  employeeName: "Ravi Sharma",
  stats: {
    total: 24,
    pending: 5,
    inProgress: 8,
    finished: 11,
    dueToday: 2,
    dueThisWeek: 6,
    highPriority: 3,
  },
  myTasks: [
    { id: "T-401", title: "Pipeline Inspection – Zone A", dueDate: "18 Nov 2026", priority: "High", status: "In Progress" },
    { id: "T-402", title: "Water Quality Report", dueDate: "19 Nov 2026", priority: "Medium", status: "Pending" },
    { id: "T-403", title: "Valve Maintenance", dueDate: "20 Nov 2026", priority: "Low", status: "In Progress" },
    { id: "T-404", title: "Connection Verification", dueDate: "15 Nov 2026", priority: "High", status: "Completed" },
  ],
  comments: [
    { title: "Your supervisor commented on Pipeline Inspection", description: "Please attach the final inspection photographs.", time: "15 minutes ago", color: "bg-blue-500" },
    { title: "You received a task update", description: "Water Quality Report deadline confirmed.", time: "2 hours ago", color: "bg-violet-500" },
  ],
  attachments: [
    { title: "Inspection_Guidelines.pdf", description: "Related to Pipeline Inspection", time: "Uploaded by supervisor" },
    { title: "Water_Quality_Template.xlsx", description: "Related to Water Quality Report", time: "Uploaded yesterday" },
  ],
};

const JuniorEmployeeDashboard = ({ data = defaultData }) => {
  const s = data.stats;

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="My Dashboard"
        subtitle={`Welcome, ${data.employeeName}. Here is your task overview.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard title="My Tasks" value={s.total} subtitle="Total assigned to you" icon={ClipboardList} tone="blue" />
        <StatCard title="Pending" value={s.pending} subtitle="Not yet started" icon={Clock} tone="amber" />
        <StatCard title="In Progress" value={s.inProgress} subtitle="Currently working on" icon={PlayCircle} tone="blue" />
        <StatCard title="Finished" value={s.finished} subtitle="Successfully completed" icon={CheckCircle2} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Due Today" value={s.dueToday} subtitle="Complete before deadline" icon={CalendarDays} tone="amber" />
        <StatCard title="Due This Week" value={s.dueThisWeek} subtitle="Upcoming deadlines" icon={Clock} tone="violet" />
        <StatCard title="High Priority" value={s.highPriority} subtitle="Requires immediate attention" icon={AlertTriangle} tone="rose" />
      </div>

      <Panel title="My Tasks" subtitle="Your assigned tasks and their current status">
        <TaskTable tasks={data.myTasks} />
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Recent Task Comments" subtitle="Latest updates and feedback">
          <InfoList items={data.comments} />
        </Panel>

        <Panel title="Latest Uploaded Attachments" subtitle="Documents related to your assigned tasks">
          <InfoList items={data.attachments} />
        </Panel>
      </div>
    </div>
  );
};

export default JuniorEmployeeDashboard;
