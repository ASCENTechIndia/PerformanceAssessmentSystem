import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  ClipboardCheck,
  LayoutList,
  UserCog,
  FileChartPie,
  ChartColumnBig,
  GitGraph,
  ListChecks,
  Hourglass,
  Menu,
  ListTodo,
  UsersRound,
} from "lucide-react";

export const HOME_ITEM = {
  id: "home",
  label: "Home",
  path: "/dashboard",
  icon: LayoutDashboard,
  group: "Navigate",
};

export const STATIC_MENU = [
  /* ============================================================
     GROUP 1 — Tasks (HOD daily workflow)
     ============================================================ */
  {
    MENUID: 1,
    MENUTITLE: "Tasks",
    children: [
      {
        MENUID: 101,
        MENUTITLE: "Assign Task",
        PAGEPATH: "/Task/AssignTask",
        ICON: ListTodo,
      },
      {
        MENUID: 102,
        MENUTITLE: "Team Tasks",
        PAGEPATH: "/Task/TeamTasks",
        ICON: UsersRound,
      },
      {
        MENUID: 103,
        MENUTITLE: "Review Queue",
        PAGEPATH: "/Task/ReviewQueue",
        ICON: Hourglass,
      },
      {
        MENUID: 104,
        MENUTITLE: "Extension Queue",
        PAGEPATH: "/Task/ExtensionQueue",
        ICON: Hourglass,
      },
    ],
  },

  /* ============================================================
     GROUP 2 — My Work (Junior daily workflow)
     ============================================================ */
  {
    MENUID: 2,
    MENUTITLE: "My Task",
    children: [
      {
        MENUID: 201,
        MENUTITLE: "My Task",
        PAGEPATH: "/Task/MyTask",
        ICON: Menu,
      },
      {
        MENUID: 202,
        MENUTITLE: "Task Status",
        PAGEPATH: "/Task/task-status",
        ICON: Menu,
      },
    ],
  },

  /* ============================================================
     GROUP 3 — Performance Details (reports, drill-down)
     ============================================================ */
  {
    MENUID: 3,
    MENUTITLE: "Performance Details",
    children: [
      {
        MENUID: 301,
        MENUTITLE: "Junior Employee",
        PAGEPATH: "/performance/junior",
        ICON: FileChartPie,
      },
      {
        MENUID: 302,
        MENUTITLE: "Senior Employee",
        PAGEPATH: "/performance/senior",
        ICON: ChartColumnBig,
      },
    ],
  },

  /* ============================================================
     GROUP 4 — Master (Setup, Admin mostly)
     ============================================================ */
  {
    MENUID: 4,
    MENUTITLE: "Master",
    children: [
      {
        MENUID: 401,
        MENUTITLE: "Employees",
        PAGEPATH: "/master/employees",
        ICON: Users,
      },
      {
        MENUID: 402,
        MENUTITLE: "Departments",
        PAGEPATH: "/master/DepartmentMaster",
        ICON: Building2,
      },
      {
        MENUID: 403,
        MENUTITLE: "Designation Master",
        PAGEPATH: "/master/DesignationMaster",
        ICON: UserCog,
      },
      {
        MENUID: 404,
        MENUTITLE: "Task Type Master",
        PAGEPATH: "/master/task-type",
        ICON: LayoutList,
      },
      {
        MENUID: 405,
        MENUTITLE: "Hierarchy Mapping",
        PAGEPATH: "/master/HierarchyMapping",
        ICON: GitGraph,
      },
    ],
  },

  /* ============================================================
     GROUP 5 — Admin (User access management)
     ============================================================ */
  {
    MENUID: 5,
    MENUTITLE: "Admin",
    children: [
      {
        MENUID: 501,
        MENUTITLE: "User Access",
        PAGEPATH: "/admin/userAccess",
        ICON: ShieldCheck,
      },
    ],
  },
  {
    MENUID: 6,
    MENUTITLE: "Task Management",
    children: [
      {
        MENUID: 601,
        MENUTITLE: "Task List",
        PAGEPATH: "/task-management/tasks",
        ICON: ListTodo,
      },
    ],
  },
];

export const ALL_NAV = [
  HOME_ITEM,
  ...STATIC_MENU.flatMap((section) => [
    {
      id: `section-${section.MENUID}`,
      label: section.MENUTITLE,
      path: null,
      icon: null,
      group: "Section",
    },
    ...(section.children || []).map((item) => ({
      id: `item-${item.MENUID}`,
      label: item.MENUTITLE,
      path: item.PAGEPATH,
      icon: item.ICON,
      group: section.MENUTITLE,
    })),
  ]),
];
