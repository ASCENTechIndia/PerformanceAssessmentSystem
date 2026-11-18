
import React from "react";
import {
    ClipboardList, ShieldCheck, Clock, AlertTriangle,
    CheckCircle2, RotateCcw, CalendarDays, FileText,
} from "lucide-react";

import {
    DashboardHeader, StatCard, Panel, TaskTable, InfoList,
} from "./DashboardUI";

import {
    DepartmentTaskChart,
    MonthlyTaskChart,
    PriorityTaskChart,
} from "./DashboardCharts";

const defaultData = {
    stats: {
        assigned: 42,
        verification: 8,
        overdue: 5,
        completed: 18,
        dueToday: 6,
        noUpdates: 4,
    },
    tasks: [
        { id: "T-301", title: "Road Inspection – Zone A", dueDate: "18 Nov 2026", priority: "High", status: "In Progress" },
        { id: "T-302", title: "Drainage Maintenance", dueDate: "18 Nov 2026", priority: "Medium", status: "Pending" },
        { id: "T-303", title: "Streetlight Verification", dueDate: "17 Nov 2026", priority: "High", status: "Overdue" },
        { id: "T-304", title: "Public Facility Inspection", dueDate: "20 Nov 2026", priority: "Low", status: "Submitted" },
    ],
    verificationTasks: [
        { id: "T-305", title: "Water Connection Inspection", dueDate: "18 Nov 2026", priority: "High", status: "Submitted" },
        { id: "T-306", title: "Road Repair Completion", dueDate: "19 Nov 2026", priority: "Medium", status: "Submitted" },
    ],
    alerts: [
        { title: "Streetlight Verification is overdue", description: "Task T-303 requires immediate attention.", time: "Due date: 17 Nov 2026", color: "bg-rose-500" },
        { title: "No progress update received", description: "4 assigned tasks have no recent updates.", time: "Requires follow-up", color: "bg-amber-500" },
        { title: "Reopened tasks need monitoring", description: "Check the latest rework submissions.", time: "Pending action", color: "bg-violet-500" },
    ],
    attachments: [
        { title: "Road_Inspection_Report.pdf", description: "Uploaded for verification", time: "Today" },
        { title: "Completion_Photo_Zone_A.jpg", description: "Recently submitted", time: "Yesterday" },
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



const SeniorOfficerDashboard = ({ data = defaultData }) => {
    const s = data.stats;

    return (
        <div className="space-y-5">
            <DashboardHeader
                title="Senior Officer Dashboard"
                subtitle="Monitor assigned tasks, verification requests and overdue work"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                <StatCard title="Assigned Tasks" value={s.assigned} subtitle="Tasks assigned to you" icon={ClipboardList} tone="blue" />
                <StatCard title="Pending Verification" value={s.verification} subtitle="Submitted for review" icon={ShieldCheck} tone="violet" />
                <StatCard title="Overdue Tasks" value={s.overdue} subtitle="Past their due date" icon={AlertTriangle} tone="rose" />
                <StatCard title="Completed Tasks" value={s.completed} subtitle="Successfully finished" icon={CheckCircle2} tone="emerald" />
                <StatCard title="Due Today" value={s.dueToday} subtitle="Require attention today" icon={CalendarDays} tone="amber" />
                <StatCard title="Without Progress Updates" value={s.noUpdates} subtitle="No recent activity" icon={Clock} tone="rose" />
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

            <Panel title="My Assigned Tasks" subtitle="Tasks currently under your responsibility">
                <TaskTable tasks={data.tasks} />
            </Panel>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Panel title="Pending Verification" subtitle="Submitted tasks awaiting your review">
                    <TaskTable tasks={data.verificationTasks} />
                </Panel>

                <Panel title="Overdue & Progress Alerts" subtitle="Tasks requiring follow-up">
                    <InfoList items={data.alerts} />
                </Panel>
            </div>

            <Panel title="Latest Uploaded Attachments" subtitle="Documents submitted with assigned tasks">
                <InfoList items={data.attachments} />
            </Panel>
        </div>
    );
};

export default SeniorOfficerDashboard;
