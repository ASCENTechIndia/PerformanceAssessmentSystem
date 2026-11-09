

export const EMPLOYEES = [
  { id: "e101", name: "Ravi Sharma", department: "IT" },
  { id: "e102", name: "Priya Menon", department: "IT" },
  { id: "e103", name: "Amit Patel", department: "IT" },
  { id: "e104", name: "Sneha Iyer", department: "IT" },
];

export const dateOffset = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
};

export const TASKS = [
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
    query: "Please clarify the report format.",
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

export const EXTENSION_REQUESTS = [
  {
    id: 1,
    taskId: "TSK-109",
    employeeId: "e101",
    requestedDeadline: dateOffset(9),
    reason: "Additional testing is required.",
    status: "Pending",
  },
];

export const QUERIES = [
  {
    id: 1,
    taskId: "TSK-110",
    employeeId: "e102",
    question: "Please clarify the report format.",
    status: "Pending",
    response: "",
  },
];

export const getEmployeeName = (id) =>
  EMPLOYEES.find((employee) => employee.id === id)?.name || "-";

export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const dayDifference = (date1, date2) => {
  return Math.round(
    (new Date(`${date1}T00:00:00Z`) -
      new Date(`${date2}T00:00:00Z`)) / 86400000
  );
};

export const getMetrics = (tasks) => {
  const completed = tasks.filter(
    (task) => task.status === "Completed" && task.completedAt
  );

  const onTime = completed.filter(
    (task) =>
      dayDifference(task.completedAt, task.approvedDeadline) <= 0
  );

  const delays = completed
    .map((task) =>
      dayDifference(task.completedAt, task.approvedDeadline)
    )
    .filter((days) => days > 0);

  const reopened = tasks.filter((task) => task.reopenCount > 0);
  const rework = tasks.filter((task) => task.reworkCount > 0);

  return {
    total: tasks.length,
    completed: completed.length,
    pending: tasks.filter(
      (task) => task.status !== "Completed"
    ).length,

    onTimeCount: onTime.length,

    onTimeRate: completed.length
      ? (onTime.length / completed.length) * 100
      : 0,

    averageDelay: delays.length
      ? delays.reduce((sum, days) => sum + days, 0) / delays.length
      : 0,

    totalDelay: delays.reduce((sum, days) => sum + days, 0),

    reopenedCount: reopened.length,

    reworkCount: rework.length,

    reworkRate: tasks.length
      ? (rework.length / tasks.length) * 100
      : 0,
  };
};
