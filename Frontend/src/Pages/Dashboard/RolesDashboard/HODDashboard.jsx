
import React from "react";
import {
    ClipboardList, CheckCircle2, Clock, AlertTriangle,
    RotateCcw, Users, ShieldCheck, MessageSquare,
} from "lucide-react";

import {
    DashboardHeader, StatCard, Panel, ProgressRow,
    TaskTable, InfoList,
} from "./DashboardUI";
import {
    DepartmentTaskChart,
    MonthlyTaskChart,
    PriorityTaskChart,
} from "./DashboardCharts";

const defaultData = {
    department: "Water Supply Department",
    stats: {
        total: 185,
        completed: 125,
        pending: 28,
        inProgress: 20,
        verification: 12,
        reopened: 5,
    },
    employees: [
        { name: "Ravi Sharma", completed: 24, total: 28 },
        { name: "Sneha Iyer", completed: 20, total: 25 },
        { name: "Suresh Rao", completed: 18, total: 24 },
        { name: "Amit Kumar", completed: 15, total: 22 },
    ],
    tasks: [
        { id: "T-201", title: "Pipeline Inspection", assignee: "Ravi Sharma", dueDate: "18 Nov 2026", priority: "High", status: "Submitted" },
        { id: "T-202", title: "Water Quality Report", assignee: "Sneha Iyer", dueDate: "19 Nov 2026", priority: "Medium", status: "In Progress" },
        { id: "T-203", title: "Valve Maintenance", assignee: "Suresh Rao", dueDate: "17 Nov 2026", priority: "High", status: "Reopened" },
    ],
    comments: [
        { title: "Ravi Sharma commented on Pipeline Inspection", description: "Inspection report uploaded for review.", time: "10 minutes ago", color: "bg-blue-500" },
        { title: "Sneha Iyer updated Water Quality Report", description: "Awaiting laboratory results.", time: "1 hour ago", color: "bg-violet-500" },
        { title: "Suresh Rao replied to a task query", description: "Clarification provided.", time: "3 hours ago", color: "bg-emerald-500" },
    ],
    attachments: [
        { title: "Pipeline_Inspection_Report.pdf", description: "Uploaded by Ravi Sharma", time: "Today" },
        { title: "Water_Quality_Report.xlsx", description: "Uploaded by Sneha Iyer", time: "Yesterday" },
    ],

    charts: {
        departmentPerformance: [
            { department: "IT", completed: 45, pending: 15 },
            { department: "Water", completed: 35, pending: 20 },
            { department: "Accounts", completed: 28, pending: 12 },
            { department: "Tax", completed: 40, pending: 10 },
            { department: "Admin", completed: 25, pending: 18 },
        ],

        monthlyTasks: [
            { month: "Jan", created: 45, completed: 35 },
            { month: "Feb", created: 55, completed: 42 },
            { month: "Mar", created: 60, completed: 50 },
            { month: "Apr", created: 48, completed: 45 },
            { month: "May", created: 70, completed: 58 },
            { month: "Jun", created: 65, completed: 60 },
        ],

        priorityDistribution: [
            { priority: "High", value: 25 },
            { priority: "Medium", value: 45 },
            { priority: "Low", value: 30 },
        ],
    }
};



const HODDashboard = ({ data = defaultData }) => {
    const s = data.stats;

    return (
        <div className="space-y-5">
            <DashboardHeader
                title="HOD Dashboard"
                subtitle={`${data.department} — Department performance and employee monitoring`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                <StatCard title="Department Tasks" value={s.total} subtitle="Total assigned tasks" icon={ClipboardList} tone="blue" />
                <StatCard title="Completed" value={s.completed} subtitle="Successfully completed" icon={CheckCircle2} tone="emerald" />
                <StatCard title="Pending" value={s.pending} subtitle="Awaiting action" icon={Clock} tone="amber" />
                <StatCard title="In Progress" value={s.inProgress} subtitle="Currently being worked on" icon={Users} tone="blue" />
                <StatCard title="Pending Verification" value={s.verification} subtitle="Require HOD review" icon={ShieldCheck} tone="violet" />
                <StatCard title="Reopened Tasks" value={s.reopened} subtitle="Require rework" icon={RotateCcw} tone="rose" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <DepartmentTaskChart
                    data={data.charts?.departmentPerformance || []}
                />

                <MonthlyTaskChart
                    data={data.charts?.monthlyTasks || []}
                />

                <div className="xl:col-span-2">
                    <PriorityTaskChart
                        data={data.charts?.priorityDistribution || []}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Panel title="Department Task Summary" subtitle="Current distribution of department tasks">
                    <div className="space-y-4">
                        <ProgressRow label="Completed" value={s.completed} total={s.total} color="bg-emerald-500" />
                        <ProgressRow label="Pending" value={s.pending} total={s.total} color="bg-amber-500" />
                        <ProgressRow label="In Progress" value={s.inProgress} total={s.total} color="bg-blue-500" />
                        <ProgressRow label="Pending Verification" value={s.verification} total={s.total} color="bg-violet-500" />
                    </div>
                </Panel>

                <Panel title="Employee Performance" subtitle="Completed tasks against assigned tasks">
                    <div className="space-y-4">
                        {data.employees.map((emp) => (
                            <ProgressRow
                                key={emp.name}
                                label={emp.name}
                                value={emp.completed}
                                total={emp.total}
                                color="bg-blue-500"
                            />
                        ))}
                    </div>
                </Panel>
            </div>

            <Panel title="Department Tasks" subtitle="Tasks requiring monitoring and action">
                <TaskTable tasks={data.tasks} showAssignee />
            </Panel>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Panel title="Recent Task Comments" subtitle="Latest employee updates">
                    <InfoList items={data.comments} />
                </Panel>

                <Panel title="Latest Uploaded Attachments" subtitle="Recently submitted employee documents">
                    <InfoList items={data.attachments} />
                </Panel>
            </div>
        </div>
    );
};

export default HODDashboard;
